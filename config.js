let configs = {
  test: {
    secret: 'supersecretykey',
    dbURL: 'mongodb://localhost:27017/twitter-api-test',
    port: 3000
  },
  dev: {
    secret: 'supersecretykey',
    dbURL: 'mongodb://localhost:27017/twitter-api-dev',
    port: 3000
  },
  prod: {
    secret: 'supersecretykey',
    dbURL: 'mongodb://localhost:27017/twitter-api-app',
    port: 3000
  }
}


let config = null

switch (process.NODE_ENV) {
case 'TEST': config = configs.test; break;
case 'PROD': config = configs.prod; break;
case 'DEV':
default: config = configs.dev; break;
}

console.log('config', config)

module.exports = config