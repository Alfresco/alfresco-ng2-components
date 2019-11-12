/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

/* tslint:disable */
let log = null;
try {
    log = new (require('@angular-devkit/core').logging.IndentLogger)('root');
    const { bold, gray, red, yellow, white } = require('@angular-devkit/core').terminal;
    const filter = require('rxjs/operators').filter;

    log
        .pipe(filter(entry => (entry.level !== 'debug')))
        .subscribe(entry => {
            let color = gray;
            let output = process.stdout;
            switch (entry.level) {
                case 'info': color = white; break;
                case 'warn': color = yellow; break;
                case 'error': color = red; output = process.stderr; break;
                case 'fatal': color = x => bold(red(x)); output = process.stderr; break;
            }

            output.write(color(entry.message) + '\n');
        });
} catch (e) {
    console.error(`Reverting to manual console logging.\nReason: ${e.message}.`);
    log = {
        debug: console.log.bind(console),
        info: console.log.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        fatal: x => { console.error(x); process.exit(100); },
        createChild: () => log
    };
}

export let logger = log;
/* tslint:enable */
