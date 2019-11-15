import express from 'express';
import sessionValidation from '../helpers/sessionValidation';
import Story from '../models/Story';
import Profile from '../models/Profile';
import profileFromCookie from '../helpers/profileFromCookie';
import Draft from '../models/Draft';
import parseCookie from '../helpers/parseCookie';

const app = express.Router();

app.post('/create', sessionValidation, async (req, res) => {
  try {
    const {
      title,
      username,
      body,
      tags,
      theme,
      notes,
      draftId,
      bannerUrl
    } = req.body;

    const profileId = await profileFromCookie(res.locals.sid);
    const profile = await Profile.findOne({_id: profileId});
    const story = await Story.create({
      title,
      username,
      body,
      tags,
      theme,
      notes,
      bannerUrl,
      profile_id: profile._id
    });

    if ( draftId ) {
      await Draft.deleteOne({_id: draftId});
    }
    
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

app.get('/all', async ( req, res ) => {
  try {
    const { 
      t,
      count
    } = req.query;

    const stories = await Story.find();

    res.send(stories);
  }

  catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post('/edit', sessionValidation, async (req, res) => {
  try {
    const {
      title,
      username,
      body,
      tags,
      theme,
      notes,
      draftId,
      bannerUrl,
      id
    } = req.body;

    await Story.findOneAndUpdate({_id: id}, {
      title,
      username,
      body,
      tags,
      theme,
      notes,
      draftId,
      bannerUrl,
    });

    res.send("Story updated succesfully");
  }

  catch(err) {
    console.log(err);
    res.status(500).send({error: err});
  }
})

// gets a profiles stories
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

app.delete('/id/:id', sessionValidation, async (req, res) => {
  try {
    const { 
      id
    } = req.params;

    const profileId = await profileFromCookie(res.locals.sid);
    await Story.findOneAndDelete({_id: id, profile_id: profileId});

    res.send("Story deleted");
  }

  catch(err) {
    console.log(err);
    res.status(500).send({error: err});
  }
});

app.get('/title/:title', async (req, res) => {
  try {
    const story = await Story.findOne({title: req.params.title}).populate("profile_id");
    res.send(story);
  }

  catch(err) {
    console.log(err);
    res.status(500).send({error: err});
  }
});

//Refactor to use new URLSEARCHPARAMS
app.get('/id/:id', sessionValidation, async (req, res) => {
  try {
    const storyId = parseCookie(req.params.id, "storyId");
    if ( !storyId ) throw new Error("Incorrect ID sent");

    const story = await Story.findOne({_id: storyId});
    res.send(story);
  }

  catch(err) {
    console.log(err);
    res.status(500).send({error: err});
  }
});





module.exports = app;