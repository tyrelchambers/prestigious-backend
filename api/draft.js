import express from 'express';
import sessionValidation from '../helpers/sessionValidation';
import profileFromCookie from '../helpers/profileFromCookie';
import Profile from '../models/Profile';
import Draft from '../models/Draft';
import Story from '../models/Story';

const app = express.Router();

app.post('/save', sessionValidation, async (req, res) => {
  try {
    const {
      title,
      author,
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
        author,
        body,
        tags,
        theme,
        notes
      }, {
        new: true
      });

      res.send("Save successful");
    }

    if ( !draftId ) {
         
      const draft = await Draft.create({
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

module.exports = app;