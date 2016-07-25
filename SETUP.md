# Quick setup

To run this project you need to have [Node and NPM](https://docs.npmjs.com/getting-started/installing-node) installed.

```
npm install
npm start
```
Then surf to [localhost:1337](localhost:1337) in your browser to run the site.

*--everything below is optional--*

You see all available api calls on [localhost:1337/api](localhost:1337/api) (when config.showApiDocs)

# Run configurations
## environments
select an environment with this command `export NODE_ENV="development"`

- `development`
  * authentication routes disabled
  * dummy data
- `dev_auth` 
  * authentication routes enabled
  * dummy data
- `auth`
  * authentication routes enabled
  * data from config.endpoints
  
these environments are defined in [server config](#server)

## run locally with QAS
Add `127.0.0.1	mijn-qas.viaa.be` to the hosts file on your computer. This is needed to intercept the data from the authentication servers.
*replace `mijn-qas.viaa.be` by the host part you have in [config](server/config/config.js).passport.saml.callbackUrl*

```
# you need to run as admin to be able to use port 80
sudo bash

# install dependencies
npm install

# set environment
export NODE_ENV="qas"

# 80 is default port for http
export PORT=80

# run the server
npm start
```

*Why all this complicated stuff?*
To be able to intercept the SAML response from the authentication servers we need to:

- add url to hosts file
- listen on port 80

# Utilities for development
## grunt watch
Automatically rebuild public folder when changes are made.
`grunt watch`

## nodemon
Automatically restart the server every time changes are made.
install: `npm install -g nodemon`
run: `nodemon ./server/server.js`

# Configuration files
### server 
[server/config/config.js](server/config/config.js)
###front-end - dashboard 
[app/js/dashboard-config.js](app/js/dashboard-config.js)
###front-end - services 
[app/js/services-config.js](app/js/services-config.js)
