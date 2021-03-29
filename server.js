//Install express server
const express = require('express');
const path = require('path');

//const appName = process.env.npm_package_name;
const appName = 'frontend';

const app = express();

console.log('App Name = ' + appName);

// Serve only the static files form the dist directory
app.use(express.static(`${__dirname}/dist/${appName}`));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(`${__dirname}/dist/${appName}/index.html`));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);