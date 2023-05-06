export const intraConstants = {
    paths: {
        token: 'https://api.intra.42.fr/oauth/token',
        me: 'https://api.intra.42.fr/v2/me',
    },
    grant_type: 'authorization_code',
}

export const jwtHeaderConstants = {
    alg: 'HS256',
    typ: 'JWT',
}

export const accessTokenConstants = {
    type: 'bearer',
}

export const pageInfoConstants = {
    defaultPage: 20,
}

export const twoFacAuthConstants = {
    type: 'email',
    length: 6,
    period: 300,
    from: 'noreply@nestjs.com',
    subject: 'Your confirmation code',
    template: 'send-2fa-pass',
    resend_period: 30,
}
