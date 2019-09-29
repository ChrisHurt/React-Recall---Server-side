const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose')

const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false
}));

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true});

const connection = mongoose.connection;
connection.once('open',()=>{
  console.log("MongoDB Database connection successful")
})

const usersRouter = require('./routes/users')
const dataCollectionsRouter = require('./routes/data')
const guessSessionsRouter = require('./routes/guesses')
const authenticationsRouter = require('./routes/sessions')

app.use('/users', usersRouter)
app.use('/datacollections', dataCollectionsRouter)
app.use('/guess-sessions', guessSessionsRouter)
app.use('',authenticationsRouter)

app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`)
})