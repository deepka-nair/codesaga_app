/**
 * CodeSaga Role & Authorization Utility Module
 */

export const DEVELOPER_EMAIL = "deepkav5008.sse@saveetha.com";

/**
 * Check if the current user has Developer / Admin role
 */
export function isDeveloper(userObj = null) {
  if (!userObj) return false;
  const cleanEmail = String(userObj.email || userObj.id || "").trim().toLowerCase();
  return userObj.role === "developer" || cleanEmail === DEVELOPER_EMAIL;
}

/**
 * Check if user is normal registered user
 */
export function isNormalUser(userObj = null, isGuest = false) {
  if (!userObj || isGuest) return false;
  return !isDeveloper(userObj);
}
