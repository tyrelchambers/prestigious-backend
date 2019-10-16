import { sess } from '../server';
import Profile from '../models/Profile';

export default async (sid, populate) => {
  const cookie = await sess.store.get(sid, (err, sess) => {
    if ( err ) return err;

    return sess;
  });

  const profile = await Profile.findOne({_id: cookie.profile});

  return profile._id;
}