#!/usr/bin/env bash

# Increase the max_user_watches
sudo sysctl -w fs.inotify.max_user_watches=524288

# Run Playwright Storybook Tests
npx playwright test --config='e2e-playwright/playwright.config.ts' || exit 1
