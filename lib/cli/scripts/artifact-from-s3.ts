#!/usr/bin/env node

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

import { exec } from './exec';
import { logger } from './logger';
import * as program from 'commander';

function test(output: string) {
    const response = exec('test !', [`-d ${output} && mkdir ${output}`], {});
    logger.info(response);
}

function awsCp(artifact: string) {
    logger.info(`aws s3 cp ${artifact}`);
    const response = exec(`aws s3 cp  ${artifact}`, [`./s3-artifact.tmp ${artifact}`], {});
    logger.info(response);
}

function zipArtifact(output: string) {
    logger.info(`Perform zip artifact ${output}`);
    const response = exec('tar', ['-xvf', `./s3-artifact.tmp`, '-C ' + options.output], {});
    logger.info(response);
}

export default function () {
    main();
}

let options;
function main() {

    program
        .version('0.2.0')
        .requiredOption('-a, --artifact [type]', ' path to the s3 artifact (tar.bz2) to download and extract')
        .requiredOption('-o, --output [type]', 'directory to extract the archive to')
        .parse(process.argv);

    options = program.opts();

    if (!options.artifact || options.artifact === '' || !options.output || options.output === '') {
        process.exit(1);
    } else if (options.artifact !== '' || options.output !== '') {
        zipArtifact(options.artifact);
        awsCp(options.output);
    }

    test(options.output);
    awsCp(options.artifact);
    zipArtifact(options.output);
}
