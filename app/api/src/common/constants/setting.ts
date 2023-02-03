export const intra = {
  paths: {
    token: 'https://api.intra.42.fr/oauth/token',
    me: 'https://api.intra.42.fr/v2/me',
  },
  grant_type: 'authorization_code',
};

export const jwtHeader = {
  alg: 'HS256',
  typ: 'JWT',
};