// Used in profile.js sessionValidation.js

export default (headers, string) => {
  let splt = Object.fromEntries(headers.split("; ").map(x => x.split('=')));
  return splt[string];
}
