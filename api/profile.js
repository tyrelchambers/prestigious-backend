import express from 'express';
import Profile from '../models/Profile';
import parseCookie from '../helpers/parseCookie';
import profileFromCookie from '../helpers/profileFromCookie';
import sessionValidation from '../helpers/sessionValidation';

const app = express.Router();

app.post('/create', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      instagram,
      username,
      website,
      twitter,
      facebook,
      reddit,
      youtube,
      nickname,
      sub,
      role
    } = req.body;

    const profile = await Profile.create({
      firstName,
      lastName,
      instagram,
      username,
      website,
      twitter,
      facebook,
      reddit,
      youtube,
      username: nickname,
      user_id: sub,
      role,
      profileCreated: true
    });

    const sessUser = profile._id;
    req.session.profile = sessUser;

    res.send(req.session.id);
  }
  catch(err) {
    console.log(err);
  }
});

app.get('/getProfile', sessionValidation, async (req, res) => {
  try {
    const profileId = await profileFromCookie(res.locals.sid);
    const profile = await Profile.findOne({_id: profileId});
    if (!profile) {
      throw new Error("Profile not found");
    }
    res.send(profile);
  }

  catch(err) {
    console.log(err);
    res.send({error: err});
  }
})

module.exports = app;
