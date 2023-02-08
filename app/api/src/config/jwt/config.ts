export const jwt = {
  secret: process.env.JWT_SECRET || 'jwtSecuredSecret',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
