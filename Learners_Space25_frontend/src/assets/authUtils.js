// authUtils.js
const TOKEN_EXPIRY_TIME = 60 *60* 1000; // 1 hour in milliseconds

export const isTokenExpired = (loginTime) => {
  if (!loginTime) return true;
  const now = Date.now();
  return now - loginTime > TOKEN_EXPIRY_TIME;
};
