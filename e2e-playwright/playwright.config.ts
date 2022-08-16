/* eslint-disable @typescript-eslint/no-unused-expressions */
/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { PlaywrightTestConfig, ReporterDescription } from '@playwright/test';
import { dotenvConfig } from '../lib/cli/tooling';
import { timeouts } from './utils/timeouts';

export const getGlobalConfig = (): PlaywrightTestConfig => {
    dotenvConfig();
    const env = process.env;
    const baseUrl = `${env.PLAYWRIGHT_STORYBOOK_E2E_HOST}:${env.PLAYWRIGHT_STORYBOOK_E2E_PORT}`;
    let report: ReporterDescription;

    return {
        timeout: timeouts.globalTest,
        globalTimeout: timeouts.globalSpec,
        testMatch: /.*\.e2e\.ts/,

        expect: {
            timeout: timeouts.large
        },

        /* Fail the build on CI if you accidentally left test.only in the source code. */
        forbidOnly: !!env.CI,

        /* Retry on CI only */
        retries: env.CI ? 2 : 0,

        /* Opt out of parallel tests on CI. */
        workers: env.PLAYWRIGHT_WORKERS ? parseInt(env.PLAYWRIGHT_WORKERS, 10) : 1,

        /* Reporter to use. See https://playwright.dev/docs/test-reporters */
        reporter: [['list'], report],
        quiet: false,

        /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
        use: {
            actionTimeout: 0,
            trace: 'retain-on-failure',
            screenshot: 'only-on-failure',
            headless: !!env.PLAYWRIGHT_HEADLESS ? (env.PLAYWRIGHT_HEADLESS === 'true') : !!env.CI,
            ignoreHTTPSErrors: true,
            bypassCSP: true,
            browserName: 'chromium',
            baseURL: baseUrl,
            viewport: {
                height: 900,
                width: 1400
            },
            launchOptions: {
                devtools: false,
                args: [
                    '--disable-web-security',
                    '--no-sandbox'
                ]
            }
        },

        projects: [
            {
                name: 'Process Services Cloud : People',
                testMatch: /.people-cloud*\.e2e\.ts/
            },
            {
                name: 'Process Services Cloud : Groups',
                testMatch: /.groups-cloud*\.e2e\.ts/
            }
        ],

    };

};

export default getGlobalConfig();
