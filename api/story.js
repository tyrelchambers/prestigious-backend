import express from 'express';
import sessionValidation from '../helpers/sessionValidation';
import Story from '../models/Story';
import Profile from '../models/Profile';
import profileFromCookie from '../helpers/profileFromCookie';

const app = express.Router();

app.post('/create', sessionValidation, async (req, res) => {
  try {
    const {
      title,
      author,
      body,
      tags,
      theme,
      notes
    } = req.body;
    const profileId = await profileFromCookie(res.locals.sid);
    const profile = await Profile.findOne({_id: profileId});
    
    const story = await Story.create({
      title,
      author,
      body,
      tags,
      theme,
      notes,
      profile_id: profile._id
    });
    
    profile.save(err => {
      if (err) throw new Error(err);

      profile.stories.push(story._id);
      profile.save();
    });

    res.send({success: "Story successfully created"});
  }

  catch(err) {
    console.log(err);
    res.send({error: "Something went wrong."});
  }
});

app.get('/profile', sessionValidation, async (req, res) => {
  try {
    const profileId = await profileFromCookie(res.locals.sid);
    const stories = await Profile.findOne({_id: profileId}, "stories").populate('stories');
    res.send(stories);
  }

  catch(err) {
    console.log(err);
  }
});

module.exports = app;