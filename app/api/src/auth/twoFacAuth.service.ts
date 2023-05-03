import { UserGetDto } from '../module/user/dto/user.dto'
import { Injectable, HttpStatus } from '@nestjs/common'
import { authenticator } from 'otplib'
import { User } from '@prisma/client'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable({})
export class TwoFacAuthService {
    constructor(private readonly mailerService: MailerService) {}
    private users: Map<string, string> = new Map<string, string>()
    private userPermission: Map<string, boolean> = new Map<string, boolean>()

    getUser(login: string): string {
        return this.users.get(login)
    }

    async send2FAConfirmationEmail(user: User): Promise<boolean> {
        this.users.delete(user.login)
        this.users.set(user.login, authenticator.generateSecret())
        authenticator.options = {
            step: 240,
            window: 1,
        }
        const TFA: string = authenticator.generate(this.users.get(user.login))
        await this.mailerService
            .sendMail({
                to: user.email, // list of receivers
                from: 'noreply@nestjs.com', // sender address
                subject: 'Your confirmation code',
                template: 'send-2fa-pass',
                context: {
                    name: user.username,
                    code: TFA,
                    expiresIn: 5,
                },
            })
            .catch(error => {
                console.log(error)
                return false
            })

        this.userPermission.set(user.login, false)
        setTimeout(() => {
            this.userPermission.set(user.login, true)
        }, 30000)

        return true
    }

    async handle2FA(user: User): Promise<any> {
        if (await this.send2FAConfirmationEmail(user))
            return {
                status: HttpStatus.OK,
                two_fac_auth_info: {
                    login: user.login,
                    two_fac_auth: true,
                    type: 'email',
                    code_length: 6,
                    period: 240,
                },
            }
        else
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                two_fac_auth_info: '2FA Email failed to send',
            }
    }

    verify2FA(login: string, code: string): boolean {
        const secret: string = this.users.get(login)
        if (secret) {
            const isValid: boolean = authenticator.check(code, secret)
            if (isValid) {
                this.users.delete(login)
                return true
            }
        }
        return false
    }

    getIsAllowedToSend(login: string): boolean {
        return this.userPermission.get(login)
    }
}
