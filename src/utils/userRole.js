/**
 * CodeSaga Role & Authorization Utility Module
 */

export const DEVELOPER_EMAILS = [
  "deepkanair8@gmail.com",
  "deepkav5008.sse@saveetha.com"
];

export const DEVELOPER_EMAIL = "deepkanair8@gmail.com";

/**
 * Check if the current user has Developer / Admin role
 */
export function isDeveloper(userObj = null) {
  if (!userObj) return false;
  const cleanEmail = String(userObj.email || userObj.id || "").trim().toLowerCase();
  return userObj.role === "developer" || DEVELOPER_EMAILS.includes(cleanEmail);
}

/**
 * Check if user is normal registered user
 */
export function isNormalUser(userObj = null, isGuest = false) {
  if (!userObj || isGuest) return false;
  return !isDeveloper(userObj);
}
