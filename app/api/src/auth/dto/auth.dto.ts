import { accessTokenConstants } from '../../common/constants/setting';
import { config } from '../../config/config';

export class AccessTokenDto {
  access_token: string;
  token_type: string;
  expires_in: number;
  created_at: number;

  constructor(accessToken: string) {
    this.access_token = accessToken;
    this.token_type = accessTokenConstants.type;
    this.expires_in = parseInt(config.jwt.expiresIn);
    this.created_at = Date.now();
  }
}
