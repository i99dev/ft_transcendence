import { UserGetDto } from '../module/user/dto/user.dto'
import { Injectable, HttpStatus } from '@nestjs/common'
import { authenticator } from 'otplib'
import { User } from '@prisma/client'
import { MailerService } from '@nestjs-modules/mailer'
import { twoFacAuthConstants } from '../common/constants/setting'
import { TwoFacAuthDto } from './dto/auth.dto'

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
        const secret = authenticator.generateSecret()
        console.log(secret)
        this.users.set(user.login, secret)
        // authenticator.options = {
        //     step: twoFacAuthConstants.period,
        //     window: 1,
        // }
        const TFA: string = authenticator.generate(this.users.get(user.login))
        await this.mailerService
            .sendMail({
                to: user.email, // list of receivers
                from: twoFacAuthConstants.from, // sender address
                subject: twoFacAuthConstants.subject,
                template: twoFacAuthConstants.template,
                context: {
                    name: user.username,
                    code: TFA,
                    expiresIn: Math.trunc(twoFacAuthConstants.period / 60),
                },
            })
            .catch(error => {
                console.log(error)
                return false
            })

        this.userPermission.set(user.login, false)
        setTimeout(() => {
            this.userPermission.set(user.login, true)
        }, twoFacAuthConstants.resend_period * 1000)
        setTimeout(() => {
            this.users.delete(user.login)
        }, twoFacAuthConstants.period * 1000)

        return true
    }

    async handle2FA(user: User): Promise<{status: HttpStatus, two_fac_auth_info: TwoFacAuthDto | string}> {
        if (await this.send2FAConfirmationEmail(user))
            return {
                status: HttpStatus.OK,
                two_fac_auth_info: {
                    login: user.login,
                    two_fac_auth: true,
                    type: twoFacAuthConstants.type,
                    code_length: twoFacAuthConstants.length,
                    period: twoFacAuthConstants.period,
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
            // const isValid: boolean = authenticator.check(code, secret)
            // if (isValid) {
                this.users.delete(login)
                return true
            // }
        }
        return false
    }

    getIsAllowedToSend(login: string): boolean {
        return this.userPermission.get(login)
    }
}
