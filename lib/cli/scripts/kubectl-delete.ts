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

import program from 'commander';
import * as kube from './kube-utils';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export default function(args: kube.KubeArgs) {
    main(args);
}

const main = (args: kube.KubeArgs) => {
    program
        .version('0.1.0')
        .option('--username [type]', 'username')
        .option('--password [type]', 'password')
        .option('--token [type]', 'access token')
        .option('--clusterEnv [type]', 'cluster Env')
        .option('--clusterUrl [type]', 'cluster Url')
        .option('--label [type]', 'label cluster')
        .parse(process.argv);

    if (process.argv.includes('-h') || process.argv.includes('--help')) {
        program.outputHelp();
        return;
    }

    if (args.label !== undefined) {
        kube.setCluster(args.clusterEnv, args.clusterUrl);
        kube.setCredentials(args.username, args.token);
        kube.setContext(args.clusterEnv, args.username);
        kube.useContext(args.clusterEnv);
        kube.deletePod(args);
    }
};
