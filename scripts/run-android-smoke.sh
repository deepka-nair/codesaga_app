#!/usr/bin/env bash
set -euo pipefail
cd "${GITHUB_WORKSPACE:-$(git rev-parse --show-toplevel)}"
export ANDROID_APP_PATH="$PWD/android/app/build/outputs/apk/debug/app-debug.apk"
export ANDROID_PLATFORM_VERSION=15
export RUN_LIVE_APPIUM=true
mkdir -p appium-tests/results
adb logcat > /tmp/codesaga-logcat.log 2>&1 &
logcat_pid=$!
npx --prefix appium-tests appium driver install uiautomator2
npx --prefix appium-tests appium --port 4723 --base-path / --allow-insecure=uiautomator2:chromedriver_autodownload > /tmp/codesaga-appium.log 2>&1 &
appium_pid=$!
trap 'kill "$appium_pid" "$logcat_pid" 2>/dev/null || true' EXIT
for service in http://127.0.0.1:4723/status; do
  for attempt in $(seq 1 60); do
    if curl -fsS "$service" > /dev/null; then break; fi
    sleep 2
  done
  curl -fsS "$service"
done
if [ "${RUN_SUBMISSION_APPIUM:-0}" = "1" ]; then
  node tests/submission/browser.mjs appium-android
else
  cd appium-tests
  npx mocha tests/mobile-smoke-tests.js tests/appium-e2e-tests.js --timeout 180000
fi
