require('dotenv').config();

const express = require("express");
const http = require("http");
const cors = require('cors');

const bodyParser = require('body-parser');

const routesUsers = require('./routes/users');
const routesLists = require('./routes/lists');
const routesLogs = require('./routes/logs');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

const server = http.createServer(app);
server.listen(3000, "192.168.1.8", () => {
    console.log("Server is listening in port 3000");
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,GET');
    next();
});

app.use('/', routesUsers);
app.use('/', routesLists);
app.use('/', routesLogs);
