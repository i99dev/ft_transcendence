# Overviews.

```bash
my-project/
├── database/
├── app/
│   ├── api/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── middlewares/
│   │   │   ├── pages/
│   │   │   ├── plugins/
│   │   │   ├── store/
│   │   │   ├── nuxt.config.ts
│   │   ├── Dockerfile
│   │   ├── package.json
├── docker-compose.yml
├── lerna.json
├── package.json
```

- Each package (api and web) now has its own **`Dockerfile`**, which is used to build the image for that specific package.
- **`docker-compose.yml`** is used to define and run multi-container Docker applications. You'll use this file to define your services (api, web, and database) and their configurations and dependencies.
- **`lerna.json`** is the configuration file for Lerna.js, which is used to manage the monorepo structure and versioning of the packages.
- **`package.json`** is the root package.json file, which contains the dependencies and scripts that apply to the entire project.

With this structure, you can use **`docker-compose up --build`** command to build and run all the services defined in the **`docker-compose.yml`** file, and easily manage the dependencies and versioning of your packages using Lerna.js.

## Team Members

🧓@Obaid Al Tenaiji |👨‍💻@Bassam Naji | @Motasem algunaid | @Abrar  | @Emad Saad 

# Development.

## Environment Value.

To set up the necessary environment variables for the API, you will need to obtain the `CLIENT_ID` and `CLIENT_SECRET` values from the [intra.42.fr](http://intra.42.fr/) API. Then, set the `REDIRECT_URI` to the page you want to redirect to after the user logs in. To do this, run the `init_docker.sh` script on your local machine and enter the required values. Once you have set the values, you can start the development servers by running `docker-compose up --build`.

## Running Applications.

Sure! `docker-compose up --build` command is used to build and rebuild all the images defined in the docker-compose file. This command is useful when you have made changes to your code or configuration files, and you want to rebuild the images with the new changes. On the other hand, the `docker-compose up` command is used to start the containers that are defined in the docker-compose file. This command will not rebuild the images, but it will use the existing images that are available on your local machine. Finally, running the `docker-compose down` command will stop and remove the containers that were started by the `docker-compose up` command.

## API.

To access the API, go to `http://localhost/api` in your web browser.

### API Docs

You can access the API documentation by going to `http://localhost/api/docs` in your web browser.

## web.

To access the front end, go to `http://localhost/` in your web browser.