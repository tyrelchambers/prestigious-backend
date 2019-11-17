import express from 'express';
import sessionValidation from '../helpers/sessionValidation';
import profileFromCookie from '../helpers/profileFromCookie';
import Profile from '../models/Profile';
import Draft from '../models/Draft';
import parseCookie from '../helpers/parseCookie';

const app = express.Router();

app.post('/save', sessionValidation, async (req, res) => {
  try {
    const {
      title,
      username,
      body,
      tags,
      theme,
      notes,
      draftId
    } = req.body;

    const profileId = await profileFromCookie(res.locals.sid);
    const profile = await Profile.findOne({_id: profileId});

    if ( draftId ) {
      await Draft.findOneAndUpdate({_id: draftId}, {
        title,
        username,
        body,
        tags,
        theme,
        notes
      }, {
        new: true
      });

      res.send({
        message: "Save successful",
        draftId
      });
    }

    if ( !draftId ) {
          
      const draft = await Draft.create({
        title,
        username,
        body,
        tags,
        theme,
        notes,
        profile_id: profile._id
      });
    
      profile.save(err => {
        if (err) throw new Error(err);
  
        if (profile.drafts.includes(draft._id)) {
          return;
        }
        
        profile.drafts.push(draft._id);
        profile.save();
      });

      res.send({draftId: draft._id});
    }

  }

  catch(err) {
    console.log(err);
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
      bannerUrl,
      id
    } = req.body;

    await Draft.findOneAndUpdate({_id: id}, {
      title,
      username,
      body,
      tags,
      theme,
      notes,
      bannerUrl,
    });

    res.send("Draft updated succesfully");
  }

  catch(err) {
    console.log(err);
    res.status(500).send({error: err});
  }
})

app.delete('/id/:id', sessionValidation, async (req, res) => {
  try {
    const { 
      id
    } = req.params;
    
    const profileId = await profileFromCookie(res.locals.sid);
    const profile = await Profile.findOne({_id: profileId});

    await Draft.findOneAndDelete({_id: id, profile_id: profileId});

    profile.save(err => {
      if ( err ) throw new Error(err);

      profile.drafts.filter((x, xID) => {
        if ( x == id ) {
          profile.drafts.splice(xID, 1);
        }
      });

      profile.save();
    });

    res.send("Draft deleted");
  }

  catch(err) {
    console.log(err);
    res.status(500).send({error: err});
  }
});

app.get('/id/:id', sessionValidation, async (req, res) => {
  try {
    const draftId = parseCookie(req.params.id, "draftId");
    if ( !draftId ) throw new Error("Incorrect ID sent");

    const draft = await Draft.findOne({_id: draftId});
    res.send(draft);
  }

  catch(err) {
    console.log(err);
    res.status(500).send({error: err});
  }
});

module.exports = app;