#!/usr/bin/env bash
set -euo pipefail
mkdir -p ../../trigger-evidence
adb shell cmd uimode night no
./gradlew --no-daemon --max-workers=2 -PnuphosIsolatedRowActionsFixture=true :app:assembleDebug :app:assembleDebugAndroidTest
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb install -r app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
adb logcat -c
adb shell am instrument -w -r -e class 'ai.nuphos.android.FixtureDeviceTest#conversationTitleOpensTriggers' ai.nuphos.android.rowactions1357.test/androidx.test.runner.AndroidJUnitRunner | tee ../../trigger-evidence/instrumentation.txt
adb exec-out screencap -p > ../../trigger-evidence/final-screen.png
adb logcat -d > ../../trigger-evidence/logcat.txt
adb pull /sdcard/Android/data/ai.nuphos.android.rowactions1357/files/review-2030/ ../../trigger-evidence/native-captures
grep -q 'OK (1 test)' ../../trigger-evidence/instrumentation.txt
adb pull /sdcard/Android/data/ai.nuphos.android.rowactions1357/files/review-2030/triggers-2096-android.png ../../trigger-evidence/android.png
