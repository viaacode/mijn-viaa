# Mijn VIAA
Dashboard and Portal site for VIAA's Content Partners.

# Getting started
## Start server
- Navigate to /server (`cd server`)
- `npm install`
- `npm start`

## Run app
- Navigate to /app (`cd app`)
- `npm install`
- `grunt` command to get files from node_modules folder (basscss grid, vue.js, jquery copy to dist/)

Go to localhost:1337 in your browser to run the site.

# Content Configuration
## Graphs and Services configuration
- Configure graphs and their API calls in /app/js/dashboard-config.js
- Configure services overview in /app/js/services-config.js

# Development 
## Server watch
If you want to have the server automatically restart on changes,
you can install nodemon `npm install nodemon -g` in /server
and run the server with the command `nodemon`

## Client watch
Run `grunt watch` in /app when editing SCSS / JS
    - watch all files in /scss folder and merge them to /public/css/styles.css
    - also watch JavaScript files in /js and copy them to /public/js

## test locally with authentication: (cert files needed)
```
sudo bash
export NODE_ENV="qas" PORT="80" && npm start
``