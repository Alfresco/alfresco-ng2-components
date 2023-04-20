#!/usr/bin/env node

/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import program from 'commander';

function zipArtifact(artifact: string) {
    logger.info(`Perform zip artifact ${artifact}`);

    const response = exec(`tar cvfj ./s3-artifact.tmp -C ${program.artifact} ls ${program.artifact}`, [] , {});
    logger.info(response);
}

function awsCp(output: string) {
    logger.info(`aws s3 cp ${output}`);
    const response = exec('aws s3 cp', [`./s3-artifact.tmp ${output}`], {});
    logger.info(response);
}

export default function() {
    main();
}

function main() {

    program
        .version('0.1.0')
        .option('-a, --artifact [type]', '  path to the artifact to archieve (tar.bz2) and upload (like ./dist)')
        .option('-o, --output [type]', ' the S3 object to copy it to, like: s3://bucket-name/folder/whatever.tar.bz2')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    if (!program.artifact || program.artifact === '' || !program.output || program.output === '') {
        process.exit(1);
    } else if (program.artifact !== '' || program.output !== '') {
        zipArtifact(program.artifact);
        awsCp(program.output);
    }
}
