import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config';
import mongoose from 'mongoose';
import session from 'express-session';
import uuidv4 from 'uuid/v4';
import profile from './api/profile';
import story from './api/story';
import draft from './api/draft';
import sessions from './api/sessions';

const MongoStore = require('connect-mongo')(session);

require('dotenv').config();

const database = config[config.env].database;

const db = mongoose.connection;
const app = express();
const port = process.env.PORT || '4000';

export const sess = {
  secret: config.development.secret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  },
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  genid: function(req) {
    return uuidv4() // use UUIDs for session IDs
  },
  name: "sid"
};

if (app.get('env') === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  app.set('trust proxy', 1);
}
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(session(sess));

app.use(express.static('helpers'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

mongoose.connect(database, {useNewUrlParser: true});

app.use('/api/profile', profile);
app.use('/api/story', story);
app.use('/api/draft', draft);
app.use('/api/sessions', sessions);

db.on('error', console.error.bind(console, "Connection error"));
db.once('open', () => console.log("Connected sucessfully to database"));


app.listen(port, () => console.log("App running on " + port));

