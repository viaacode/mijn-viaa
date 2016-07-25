# Installation

To run this project you need to have [Node and NPM](https://docs.npmjs.com/getting-started/installing-node) installed.

## Run
```
npm install
npm start
```

## Specific configurations
### development (default)
development environment is the default when `NODE_ENV` is not set
dummy data for API calls
```
npm install
export NODE_ENV="development"
npm start
```

### dev_auth (default)
development with authentication routes enabled
dummy data for API calls
```
npm install
export NODE_ENV="development"
npm start
```

### qas (default)
authentication enabled, forward data from endpoints
```
npm install
export NODE_ENV="development"
npm start
```