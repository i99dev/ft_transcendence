import { PrismaClient } from '@prisma/client';
import { NewUser } from '../../app/user/interface/user.interface';
import { accessToken, jwtHeader } from '../../common/constants/setting';
const jwt = require('jsonwebtoken');
import { config } from '../../config/config';
import { AccessTokenDto } from '../dto/auth.dto';
import { Me } from '../interfaces/auth.interface';

export class AuthRepository {
  private prisma = new PrismaClient();
  getJwt(data): Me {
    const header = jwtHeader;
    const payload = { login: data.login };
    return jwt.sign(payload, config.jwt.secret, { header });
  }
  getAccessToken(tok): AccessTokenDto {
    let token: AccessTokenDto = {
			access_token: tok,
			token_type: accessToken.type,
			expires_in: parseInt(config.jwt.expiresIn),
			created_at: Date.now(),
		}
    return token;
  }

  async userExists(login: string): Promise<boolean> {
		return await this.prisma.user.findUnique({ where:{login: login} }) ? true : false;
	}
}
