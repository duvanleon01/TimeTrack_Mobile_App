const express = require('express');
const passport = require('passport');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const usersRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const port = process.env.PORT || 3000;
const IP_ADDRESS = '192.168.80.13';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
    secret: 'secret-key-that-you-should-change',
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport); 

app.disable('x-powered-by');

app.set('port', port);

usersRoutes(app);
attendanceRoutes(app);

server.listen(port, IP_ADDRESS, function(){
  console.log('App node.js ' + process.pid + ' ejecutando en ' + server.address().address + ':' + server.address().port);
});

app.get('/', (req, res) => {
  res.send('Ruta raíz del Backend');
});

app.get('/test', (req, res) => {
  res.send('Ruta TEST');
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});