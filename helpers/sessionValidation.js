import parseCookie from './parseCookie';

const sessionValidation = (req, res, next) => {
  const cookie = parseCookie(req.headers.cookie, "sid")
  if ( !cookie ) {
    throw new Error("No session ID was sent with request");
  } else {
    res.locals.sid = cookie;
    next();
  }
}

module.exports = sessionValidation;