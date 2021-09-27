# User Post Management GraphQL API

This is a GraphQL API that exposes a Mongodb based User Post service

## Getting Started

### Pre-requisites:
- To Run with Docker
1. [Docker](https://docs.docker.com/engine/install/ubuntu/)
2. [Docker Compose](https://docs.docker.com/compose/install/)

- To run standalone without docker:
1. [Node.Js](https://nodejs.org/download/release/v12.22.6/) - v12.22.6
2. [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
2. [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 6.14.15
3. [MongoDB](https://docs.mongodb.com/manual/installation/)

<br />

### Running with docker compose:
1. Make sure docker and docker-compose are properly installed.
2. Run command 
    ```
    docker-compose -f docker-compose.yaml up --build
    ```
3. Wait for the services to start. 
4. Service can be accessed at `localhost:4000`

<br />

### Running as standalone service:
1. This will require a running instance of mongoDB. You can either create one or start one using following command:
  ```
    docker-compose -f docker-compose.yaml up mongo
  ```
  You can connect to this instance at `mongodb://0.0.0.0:27017/${dbname}`
  
2. Run following commands in order:
  ```
    nvm use
    npm install
    npm start
  ```
3. For test and coverage:
  ```
    npm run test
  ```
4. For Build:
  ```
    npm run build
  ```
5. Get going by visiting https://studio.apollographql.com/sandbox/explorer . Use http://localhost:4000 as server endpoint
6. Environment variables can be configured via `./src/config`
7. Docker env variables can be configured via `./backend.env`. Make sure to rebuild using
```
    docker-compose down
    docker-compose -f docker-compose.yaml up --build
```
8. Schema definitions can be found [here](https://studio.apollographql.com/sandbox/schema/reference).
<br />
<br />

- ### Quick References:
  https://studio.apollographql.com/sandbox/explorer <br>
  https://www.npmjs.com/package/graphql <br>
  https://graphql.org/learn/


