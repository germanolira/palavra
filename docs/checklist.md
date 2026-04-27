# Google Play Store Submission Checklist for Expo React Native App

## Prerequisites
- [x] Google Play Developer account created ($25 one-time fee)
- [x] EAS CLI installed globally (`npm install -g eas-cli`)
- [x] Authenticated with Expo account (`eas login`)
- [ ] Production build ready for submission

## App Configuration
- [x] App name set to "Palavra" in app.json
- [ ] Store display name set to "Palavra: Caça-palavras" (configured in Play Console)
- [x] Package name set to `com.howdy.palavra` in app.json
- [ ] Version (`expo.version`) and build number (`expo.android.versionCode`) updated
- [ ] Target SDK >= 35 (confirmed: Expo SDK 55 targets API 35)
- [ ] 16KB page size support confirmed (Expo SDK 55+)
- [x] App icon: 1024x1024 PNG (EAS will generate Android 512x512 versions)
- [x] Splash screen configured with appropriate image and background color
- [x] Orientation set to portrait
- [x] No dangerous/requested permissions that aren't actually used

## Store Listing Preparation
- [x] Short description (max 80 characters) — 76 chars, em docs/store-listing.md
- [x] Full description (max 4000 characters) — 2.412 chars, em docs/store-listing.md
- [x] App icon: 512x512 px PNG (32-bit with alpha) — Generated from 1024x1024 source
- [ ] Feature graphic: 1024 x 500 px JPG or PNG
- [ ] At least 2 phone screenshots (16:9 or 9:16 aspect ratio, min 320px, max 3840px)
- [ ] Tablet screenshots (if tablet support enabled - NOT REQUIRED: 
    • iOS: controlled by `ios.supportsTablet` (set to false)
    • Android: declared by providing tablet screenshots in Play Console - we will NOT provide these)
- [ ] Promo video URL (optional, YouTube link)
- [ ] Privacy policy URL (required - must be accessible and comprehensive)
- [ ] Support URL or email for user contact
- [ ] Website URL (optional)

## Content & Compliance
- [ ] Content rating questionnaire completed (via Google Play Console)
- [ ] Target audience declared (age groups, etc.)
- [ ] Data safety form completed (declare all data collection practices)
- [ ] App category selected (likely: Education > Word Games or similar)
- [ ] Tags selected (optional but recommended for discoverability)
- [ ] Pricing set (currently free - confirm no in-app purchases or paid features)
- [ ] Country distribution configured (typically worldwide unless restrictions apply)

## Build & Submission Process
- [ ] EAS build configured for production (`eas.json` with production profile)
- [ ] Production Android build created (`eas build --platform android --profile production`)
- [ ] Build outputs .aab (Android App Bundle) format required by Google Play
- [ ] First build uploaded manually to Play Console (API limitation requirement)
- [ ] Google Service Account key created and configured for EAS Submit (optional but recommended for automation)
- [ ] Subsequent releases can use `eas submit --platform android` after initial manual upload

## Internal Testing & Release
- [ ] Create internal testing track in Play Console
- [ ] Distribute to testers via email links or Google Groups
- [ ] Collect feedback and fix any issues
- [ ] Promote to production track when ready
- [ ] Complete store listing before submitting for review
- [ ] Submit for review and wait for approval (typically 1-7 days)
- [ ] Release to production after approval

## Verification Items (Manual Checks)
- [x] Verify app icon is 1024x1024 PNG in assets/icon.png (1024x1024 RGBA)
- [x] Verify splash screen image exists in assets/splash-icon.png
- [x] Verify adaptive icon foreground in assets/adaptive-icon.png (1024x1024 RGBA)
- [ ] Confirm no unnecessary permissions in app.json/android.permissions (if used)
- [ ] Check that app functions correctly on physical devices (not just emulator)
- [ ] Test all game mechanics and features thoroughly
- [ ] Verify haptics work correctly (if used)
- [ ] Confirm offline functionality if applicable
- [ ] Check for any crashes or errors during extended use

## Post-Submission
- [ ] Monitor user reviews and ratings
- [ ] Respond to user feedback appropriately
- [ ] Track crash reports and ANRs via Play Console
- [ ] Plan regular updates with bug fixes and feature improvements
- [ ] Keep dependencies updated (especially Expo SDK)
- [ ] Maintain privacy policy and terms of service
- [ ] Update store listing with significant changes