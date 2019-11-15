import express from 'express';
import Profile from '../models/Profile';
import profileFromCookie from '../helpers/profileFromCookie';
import sessionValidation from '../helpers/sessionValidation';
import Draft from '../models/Draft';

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

app.get('/drafts', sessionValidation, async (req, res) => {
  try {
    const profileId = await profileFromCookie(res.locals.sid);
    const drafts = await Draft.find({profile_id: profileId});

    res.send(drafts);
  }

  catch(err) {
    console.log(err)
    res.status(500).send(err);
  }
});

module.exports = app;
