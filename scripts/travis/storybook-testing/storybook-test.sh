#!/usr/bin/env bash

# Increase the max_user_watches
sudo sysctl -w fs.inotify.max_user_watches=524288

# Run Playwright Storybook Tests
# NOTE: Test excluded due to Storybook not generating properly - https://alfresco.atlassian.net/browse/AAE-8048
#npx playwright test --config='e2e-playwright/playwright.config.ts' || exit 1
