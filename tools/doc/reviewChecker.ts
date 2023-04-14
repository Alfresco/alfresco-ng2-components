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

import * as path from 'path';
import * as fs from 'fs';
import * as process from 'process';

import { GraphQLClient } from 'graphql-request';
import * as remark from 'remark';
import * as frontMatter from 'remark-frontmatter';
import * as yaml from 'js-yaml';
import * as moment from 'moment';
import { of } from 'rxjs';

import * as libsearch from './libsearch';
import { Stoplist } from './stoplist';

const adf20StartDate = '2017-11-20';

const commitWeight = 0.1;
const scoreTimeBase = 60;

const libFolder = 'lib';
const stoplistFilePath = path.resolve('tools', 'doc', 'commitStoplist.json');

const angFilePattern = /(component)|(directive)|(model)|(pipe)|(service)|(widget)/;

const srcData = {};
const stoplist = new Stoplist(stoplistFilePath);

const docsFolderPath = path.resolve('docs');

const libFolders = ['core', 'content-services', 'extensions', 'insights', 'process-services', 'process-services-cloud'];

libsearch(srcData, path.resolve(libFolder));

const authToken = process.env.graphAuthToken;

const client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
        Authorization: 'Bearer ' + authToken
    }
});

const query = `query commitHistory($path: String) {
  repository(name: "alfresco-ng2-components", owner: "alfresco") {
    ref(qualifiedName: "development") {
      target {
        ... on Commit {
          history(first: 15, path: $path) {
            nodes {
              pushedDate
              message
            }
          }
        }
      }
    }
  }
}`;

const docFiles = getDocFilePaths(docsFolderPath);

const docNames = of(docFiles);

console.log('\'Name\',\'Review date\',\'Commits since review\',\'Score\'');

docNames.subscribe(docs => {

    docs.forEach(x => {
        const key = path.basename(x, '.md');

        if (!srcData[key]) {
            return;
        }

        const vars = {
            path: 'lib/' + srcData[key].path
        };

        client.request(query, vars).then(data => {
            const nodes = data['repository'].ref.target.history.nodes;

            const lastReviewDate = getDocReviewDate(x); // (key + ".md");

            const numUsefulCommits = extractCommitInfo(nodes, lastReviewDate, stoplist);
            if (numUsefulCommits > 0) {
                const dateString = lastReviewDate.format('YYYY-MM-DD');
                const score = priorityScore(lastReviewDate, numUsefulCommits).toPrecision(3);

                console.log(`'${key}','${dateString}','${numUsefulCommits}','${score}'`);
            }
        });
    });
});

function priorityScore(reviewDate, numCommits) {
    const daysSinceReview = moment().diff(reviewDate, 'days');
    const commitScore = 2 + numCommits * commitWeight;
    return Math.pow(commitScore, daysSinceReview / scoreTimeBase);
}

function getDocReviewDate(docFileName) {
    const mdFilePath = path.resolve(docsFolderPath, docFileName);

    const mdText = fs.readFileSync(mdFilePath);
    const tree = remark().use(frontMatter, ['yaml']).parse(mdText);

    let lastReviewDate = moment(adf20StartDate);

    if (tree.children[0].type === 'yaml') {
        const metadata = yaml.load(tree.children[0].value);

        if (metadata['Last reviewed']) {
            lastReviewDate = moment(metadata['Last reviewed']);
        }
    }

    return lastReviewDate;
}

function extractCommitInfo(commitNodes, cutOffDate, stoplist) {
    let numUsefulCommits = 0;

    commitNodes.forEach(element => {
        if (!stoplist.isRejected(element.message)) {
            // const abbr = element.message.substr(0, 15);

            const commitDate = moment(element.pushedDate);

            if (commitDate.isAfter(cutOffDate)) {
                numUsefulCommits++;
            }
        }
    });

    return numUsefulCommits;
}

function getDocFilePaths(folderPath) {
    const result = [];

    libFolders.forEach(element => {
        const libPath = path.resolve(folderPath, element);
        addItemsRecursively(libPath, result);
    });

    return result;

    function addItemsRecursively(elementPath: string, resultList: string[]) {
        const items = fs.readdirSync(elementPath);

        items.forEach(item => {
            const fullItemPath = path.resolve(elementPath, item);
            const itemInfo = fs.statSync(fullItemPath);

            if (itemInfo.isDirectory()) {
                addItemsRecursively(fullItemPath, resultList);
            } else if (
                (path.extname(fullItemPath) === '.md') &&
                (item !== 'README.md') &&
                (item.match(angFilePattern))
            ) {
                resultList.push(fullItemPath);
            }
        });
    }
}
