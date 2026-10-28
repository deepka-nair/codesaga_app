export const categories = [
  ['Mobile Launch & App Lifecycle', 1, 35], ['Mobile Auth & Guest Access', 36, 75],
  ['Touch Gestures, Swipe & Pinch/Zoom', 76, 110], ['Mobile Code Editor & Keyboard Inputs', 111, 140],
  ['Device Features (Camera, Biometrics, Push)', 141, 165], ['Screen Orientation (Portrait/Landscape)', 166, 185],
  ['Offline Mode & Mobile Network Resilience', 186, 220], ['Hybrid WebView & Context Switching', 221, 245],
  ['Mobile UI, Accessibility IDs & Dark Theme', 246, 275], ['Android UiAutomator2 vs iOS XCUITest Compatibility', 276, 295],
  ['Mobile Security, SSL Pinning & Storage', 296, 310]
];
export const implementedTitles = {
  1: 'Login email and guest controls render after cold launch',
  2: 'Login screen survives background and foreground transition',
  36: 'Guest access opens the world dashboard',
  37: 'Guest session survives process termination and relaunch',
  38: 'Guest can open profile from dashboard',
  39: 'Profile back button returns to world dashboard',
  40: 'Logout returns to login screen',
  41: 'Invalid email fails the login form validity check',
  42: 'Email field accepts entered text',
  76: 'Dashboard scroll reveals the backend world card'
};
export const scenarios = categories.flatMap(([category, start, end]) =>
  Array.from({ length: end - start + 1 }, (_, i) => {
    const number = start + i;
    return { id: `TC_APP_${String(number).padStart(3, '0')}`, number, category,
      title: implementedTitles[number] || `${category}: scenario ${number} — assertion not implemented`,
      implemented: Boolean(implementedTitles[number]) };
  }));
