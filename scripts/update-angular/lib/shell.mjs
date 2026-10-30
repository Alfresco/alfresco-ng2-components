/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { execFileSync } from 'node:child_process';

const MAX_OUTPUT_BYTES = 64 * 1024 * 1024;

/**
 * Runs a command and returns its output.
 * @param command executable to run
 * @param args command arguments
 * @returns what the command printed
 */
export function run(command, args) {
    return execFileSync(command, args, { encoding: 'utf8', maxBuffer: MAX_OUTPUT_BYTES });
}
