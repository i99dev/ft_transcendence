import { UserGetDto } from '../module/user/dto/user.dto'
import { Injectable, HttpStatus, InternalServerErrorException } from '@nestjs/common'
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

        const verificationCode: string = this.generateOTP()
        this.users.set(user.login, verificationCode)
        await this.sendEmail(user, verificationCode)

        this.userPermission.set(user.login, false)
        setTimeout(() => {
            this.userPermission.set(user.login, true)
        }, twoFacAuthConstants.resend_period * 1000)
        setTimeout(() => {
            this.users.delete(user.login)
        }, twoFacAuthConstants.period * 1000)

        return true
    }

    async handle2FA(user: User): Promise<TwoFacAuthDto> {
        if (await this.send2FAConfirmationEmail(user))
            return {
                login: user.login,
                two_fac_auth: true,
                type: twoFacAuthConstants.type,
                code_length: twoFacAuthConstants.length,
                period: twoFacAuthConstants.period,
            }
        else
            throw new InternalServerErrorException('2FA Email failed to send')
    }

    verify2FA(login: string, code: string): boolean {
        const verificationCode: string = this.users.get(login)
        if (verificationCode && code === verificationCode) {
            this.users.delete(login)
            return true
        }
        return false
    }

    getIsAllowedToSend(login: string): boolean {
        return this.userPermission.get(login)
    }

    generateOTP = (length = 6) => {
        let otp = ''

        for (let i = 0; i < length; i++)
            otp += Math.floor(Math.random() * 10)

        return otp
    }

    async sendEmail(user: User, code: string): Promise<boolean> {
        await this.mailerService
            .sendMail({
                to: user.email, // list of receivers
                from: twoFacAuthConstants.from, // sender address
                subject: twoFacAuthConstants.subject,
                template: twoFacAuthConstants.template,
                context: {
                    name: user.username,
                    code: code,
                    expiresIn: Math.trunc(twoFacAuthConstants.period / 60),
                },
            })
            .catch(error => {
                console.log(error)
                return false
            })
        return true
    }
        
}
