import { UserGetDto } from '../module/user/dto/user.dto'
import { Injectable, HttpStatus } from '@nestjs/common'
import { authenticator } from 'otplib'
import { User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable({})
export class TwoFacAuthService {
    constructor(private readonly mailerService: MailerService) {}
    private users: Map<string, string> = new Map<string, string>()

    getUser(login: string): string {
        return this.users.get(login)
    }

    async send2FAConfirmationEmail(user: User): Promise<boolean> {
        this.users.delete(user.login)
        this.users.set(user.login, authenticator.generateSecret())
        authenticator.options = {
            step:240,
            window: 1,
        }
        // const TFAS = authenticator.generateSecret();
        // const TFAS = 'MK6AA6SWKARHJBOK';
        const TFA: string = authenticator.generate(this.users.get(user.login));
        console.log(TFA)
        console.log(this.users.get(user.login))
        // console.log(authenticator.check(TFA, this.users.get(user.login)))
        // console.log(authenticator.verify({ token: TFA, secret: this.users.get(user.login) }))
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
            .catch((error) => {
                console.log(error)
                return false
            })
            console.log("done")
            return true
        }

    verify2FA(login: string, code: string): boolean {
        const secret: string = this.users.get(login)
        console.log(authenticator.allOptions())
        console.log(code, secret)
        // console.log(authenticator.verify({ token: code, secret: secret }))
        if (secret) {
            const isValid: boolean = authenticator.check(code, secret )
            if (isValid) {
                this.users.delete(login)
                return true
            }
        }
        return false
    }
}
