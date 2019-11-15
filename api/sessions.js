import express from 'express';
import Profile from '../models/Profile';

const app = express.Router();

app.post('/new', async ( req, res ) => {
  try {
    const profile = await Profile.findOne({user_id: req.body.sub});
    req.session.profile = profile._id;
    res.send(req.session.id);
  }

  catch(err) {
    console.log(err);
    res.send({error: err});
  }
});

module.exports = app;