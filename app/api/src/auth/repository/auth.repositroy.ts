import { jwtHeader } from "../../common/constants/setting";
const jwt = require('jsonwebtoken');
import { config } from "../../config/config";

export class AuthRepository {
  getJwt(data): any {
    const header = jwtHeader;
		const payload = {login: data.login,}
		return jwt.sign(payload, config.jwt. secret, { header });
  }
}