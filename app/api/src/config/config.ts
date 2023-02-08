import { app } from './app/config'
import { auth } from './auth/config'
import { database } from './database/config'
import { jwt } from './jwt/config'

export default () => ({
  app: app,
  auth: auth,
  database: database,
  jwt: jwt,
});
