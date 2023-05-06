export const jwt = {
    secret: process.env.JWT_SECRET || 'jwtSecuredSecret',
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
}
