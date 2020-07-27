//mongod --dbpath=data --bind_ip 127.0.0.1
const express  = require("express"),
      http     = require("http"),
      mongoose = require("mongoose"),
      app      = express(),
      passport = require('passport')
      session  = require('express-session');

const port   = 5000,
      host   = "localhost",
      server = http.createServer(app)


const setRouter   = require('./routes/setsRouter'),
      cardsRouter = require('./routes/cardsRouter'),
      usersRouter = require('./routes/usersRouter');


app.use(express.urlencoded({ extended: true }));

//MONGOOSE SETUP
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

url = 'mongodb://localhost:27017/flash_cards';

const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

app.use(passport.initialize())

//ROUTERS
app.use("/sets", setRouter);
app.use("/sets", cardsRouter);
app.use("/users", usersRouter);


server.listen(port, host, () => {
    console.log(`Server is running at https://${host}:${port}`)
})
