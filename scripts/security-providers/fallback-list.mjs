/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Fallback list of known malicious packages.
 * Used when external APIs (OSV, GitHub) are unreachable.
 * These are confirmed supply chain attacks (not regular CVEs).
 */
export const FALLBACK_BLOCKED_PACKAGES = {
    '@solana/web3.js': {
        versions: ['1.95.6', '1.95.7'],
        reason: 'Compromised - steals private keys (Dec 2024)'
    },
    '@lottiefiles/lottie-player': {
        versions: ['2.0.5', '2.0.6', '2.0.7'],
        reason: 'Compromised - crypto wallet drainer (Oct 2024)'
    },
    'node-ipc': {
        versions: ['9.2.2', '10.1.1', '10.1.2', '10.1.3', '11.0.0', '11.1.0'],
        reason: 'Protestware - overwrites files (Mar 2022)'
    },
    'ua-parser-js': {
        versions: ['0.7.29', '0.8.0', '1.0.0'],
        reason: 'Compromised - cryptominer and password stealer (Oct 2021)'
    },
    'coa': {
        versions: ['2.0.3', '2.0.4', '2.1.1', '2.1.3', '3.0.1', '3.1.3'],
        reason: 'Compromised - password stealer (Nov 2021)'
    },
    'rc': {
        versions: ['1.2.9', '1.3.9', '2.3.9'],
        reason: 'Compromised - exfiltrates environment variables (Nov 2021)'
    },
    'colors': {
        versions: ['1.4.1', '1.4.44-liberty-2'],
        reason: 'Sabotage - infinite loop (Jan 2022)'
    },
    'faker': {
        versions: ['6.6.6'],
        reason: 'Sabotage - no functionality (Jan 2022)'
    },
    'event-stream': {
        versions: ['3.3.6'],
        reason: 'Compromised - bitcoin wallet theft (Nov 2018)'
    }
};
