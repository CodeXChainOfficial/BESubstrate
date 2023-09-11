# Sub-Strate-Name Service

Microservice for Substrate

## Quick start

1. Run `npm install` in the project directory
2. Optionally make edits to `config.yaml` or create `config.custom.yaml`

## Dependencies

1. Redis Server is required to be installed [docs](https://redis.io/).
2. PostgreSQL is required to be installed [docs](https://www.postgresql.org/).

You can run `docker-compose up` in a separate terminal to use a local Docker container for all these dependencies.

After running the sample, you can stop the Docker container with `docker-compose down`

## Available Features

These features can be enabled/disabled in config file

### `Public API`

Endpoints that can be used by anyone (public endpoints).

### `Private API`

Endpoints that are not exposed on the internet
For example: We do not want to expose cache interactions to anyone (/cache)


### `Transaction Processor`

This is used for scanning the transactions from MultiversX Blockchain.



## Available Scripts

This is a MultiversX project built on Nest.js framework.

### `npm run start:mainnet`

​
Runs the app in the production mode.
Make requests to [http://localhost:3001](http://localhost:3001).

Redis Server is required to be installed.

## Running the app

```bash
# development watch mode on devnet
$ npm run start:devnet:watch

# development debug mode on devnet
$ npm run start:devnet:debug

# development mode on devnet
$ npm run start:devnet

# production mode
$ npm run start:mainnet
```

Requests can be made to http://localhost:3001. The app will reload when you'll make edits (if opened in watch mode). You will also see any lint errors in the console.​

### `npm run test`

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
