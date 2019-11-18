import express from 'express';
import sessionValidation from '../helpers/sessionValidation'
import profileFromCookie from '../helpers/profileFromCookie';
import Profile from '../models/Profile';
import Message from '../models/Message';

const app = express.Router();

app.post('/send', sessionValidation, async (req, res) => {
  try {
    const {
      to,
      from,
      body
    } = req.body;
    
    // REFACTOR ME
    const profileId = await profileFromCookie(res.locals.sid);
    const profile = await Profile.findOne({_id: profileId});
    //

    console.log(to, from)
  }

  catch(err) {
    console.log(err);
    res.status(500).send({error: err});
  }
})

module.exports = app;