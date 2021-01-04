// Imports:
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;  // Get it from env variable or default: 3000
const server = http.createServer(app);

server.listen(port);