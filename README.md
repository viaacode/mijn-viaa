# mijnviaa
Portaal voor content providers van VIAA

## To Know

- `npm install` after pulling
- `grunt` command to get files from node_modules folder (basscss grid, vue.js, jquery copy to dist/)
- `grunt watch` to watch all files in /scss folder and merge them to dist/styles.css

## Start server
```
cd server
npm install
npm start
```
If you want to have the server automatically restart on changes,
you can install nodemon `npm install nodemon -g`
and run the server with the command `nodemon`


### test locally with authentication: (cert files needed)
```
sudo bash
export NODE_ENV="qas" PORT="80" && npm start
``