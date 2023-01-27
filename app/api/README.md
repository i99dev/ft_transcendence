<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Default env file

```bash
cp .env_sample .env
```

## Run Docker compose
run docker compose on main directory of repo if it's not running
```bash
docker compose up
# OR
docker-compose up

```

## Database migration

```bash
# The command should run inside docker since the database container are not exposed to the host but for db_net network only.
# db_net is shared between the database and the backend containers.

docker exec -it ft_transcendence-api-1 npx prisma migrate dev --name "<migration_name>" # make sure you are using the right api contianer name (ft_transcendance)
```


## Pre-populate the database with initial data

```bash
# The command should run inside docker since the database container are not exposed to the host but for db_net network only.
# db_net is shared between the database and the backend containers.

docker exec -it ft_transcendence-api-1 npx prisma db seed # make sure you are using the right api contianer name (ft_transcendance)
```

## Access Database with Pgadmin
**NOTE:** names like ```PGADMIN_DEFAULT_EMAIL``` are environment variables that is used in ```.env``` under the root path of the repo.
1. Connect to ```localhost:5050``` and. Enter ```PGADMIN_DEFAULT_EMAIL``` and ```PGADMIN_DEFAULT_PASSWORD```.
2. Go to ```object``` => ```register``` => ```Server...```.
3. Setup any name for the server under ```General```
4. Under ```Connection``` set ```Hostname/address``` to ```db``` and set Username to ```PGADMIN_DEFAULT_EMAIL``` and ```PGADMIN_DEFAULT_PASSWORD```.
5. Click ```Save```.
6. Now on the left you find your server name under ```Servers```.
7. Go to ```Servers``` => server_name => ```databases``` => ```POSTGRES_DB``` => ```Shcemas``` => ```public``` => ```Tables```.
8. If database has been migrated you will find some tables under ```Tables``` like ```User```.
9. Right click on the table and go to ```View/Edit Data``` => ```All Rows```.
10. if database has pre-populated with initial data you will find some data. Otherwise, you will get an empty table.

## EndPoints
### GET
1. ```(/api/users)``` => to get all users in the database.
2. ```(/api/users/:name)``` => type a specific name to get the information of a specific user.
3. ```(/api/users/:name/:info)``` => to get a specific info only from the mentioned user.
### POST
4. ```(/api/post)``` => add users by passing a JSON with the info of the new user.
### PATCH
5. ```(/api/patch/:name)``` => update an existing user by passing a JSON and passing the login of that user in the url.
### DELETE
6. ```(/api/delete/:name)``` =>by passing the login of the user, the user will get deleted permanentley from the database.


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
