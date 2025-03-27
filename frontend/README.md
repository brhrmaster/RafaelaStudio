# Sistema Controle Estoque - Rafaela Studio

## Have NVM (NodeJS Version Manager) installed [dowload for windows](https://github.com/coreybutler/nvm-windows/releases)

```bash
nvm install 22
```

## Have all libs (node modules) available

```bash
npm install
```

## Development server

To start a local development server, run:

```bash
npm run start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building (optional) -> or you can use docker compose from [here](../)

To build the project run:

```bash
npm run build --prod
```

## Create a Docker image from this project build

execute:

```bash
docker build -t rafaela-studio-app .
```

## Create a Docker container from generated project build

execute:

```bash
docker run -d --name=rafaela-studio-app -p 3000:80 rafaela-studio-app:latest
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
