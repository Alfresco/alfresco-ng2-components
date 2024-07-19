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

async function getPRDetails(github, core, owner, repo, pull_number, limitFileChanged, limitLinesChanged) {
    const { data: files } = await github.rest.pulls.listFiles({
        owner,
        repo,
        pull_number
    });

    let filesChanged = files.length;
    let linesChanged = files.reduce((total, file) => total + file.additions + file.deletions, 0);

    let level = 'unknown';
    let packageName = 'unknown';
    let packagesAffected = new Set();
    for (let file of files) {
        if (file.filename.startsWith('lib/core/')) {
            level = 'major';
            packagesAffected.add(file.filename.split('/')[2]);
            break;
        } else if (file.filename.startsWith('lib/extensions/')) {
            level = 'major';
            packagesAffected.add(file.filename.split('/')[2]);
            break;
        } else if (file.filename.startsWith('lib/contetent-services/') || file.filename.startsWith('lib/process-services-cloud/')) {
            level = 'minor';
            packagesAffected.add(file.filename.split('/')[2]);
            break;
        } else {
            level = 'minor';
            packagesAffected.add(packageName);
        }
    }

    if (level !== 'major') {
        if (filesChanged > limitFileChanged) {
            level = 'major';
        } else if (linesChanged > limitLinesChanged) {
            level = 'major';
        }
    }

    return {
        filesChanged,
        linesChanged,
        level: level,
        packagesAffected: Array.from(packagesAffected)
    };
}

module.exports = async ({ core, github, context, fileChangedLimit = 5, linesChangedLimit = 50 }) => {
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const pull_number = context.payload.pull_request.number;

    core.info(`Getting PR details for ${owner}/${repo}#${pull_number}`);
    core.info(`Limit for files changed: ${fileChangedLimit}`);
    core.info(`Limit for lines changed: ${linesChangedLimit}`);

    const details = await getPRDetails(github, core, owner, repo, pull_number, fileChangedLimit, linesChangedLimit);

    core.info(`PR details: ${JSON.stringify(details)}`);
    core.setOutput('level', details.level);
};
