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

function determineComplexity(changedFiles, totalFilesChanged, totalLinesChanged, limitFileChanged, limitLinesChanged) {
    let level = 'unknown';
    let packagesAffected = new Set();

    // Determine packagesAffected and if the level should be major based on file paths
    for (let filePath of changedFiles) {
        if (filePath.startsWith('lib/core/') || filePath.startsWith('lib/extensions/') || filePath.startsWith('lib/js-api/')) {
            level = 'major';
            packagesAffected.add(filePath.split('/')[2]);
        }
    }

    // Check if the number of files or lines changed exceeds limits
    if (totalFilesChanged > limitFileChanged || totalLinesChanged > limitLinesChanged) {
        level = 'major';
    }

    return {
        filesChanged: totalFilesChanged,
        linesChanged: totalLinesChanged,
        level: level,
        packagesAffected: Array.from(packagesAffected) // Convert Set to Array for the output
    };
}

async function getPRDetails(github, core, owner, repo, pull_number, limitFileChanged, limitLinesChanged) {
    const { data: files } = await github.rest.pulls.listFiles({
        owner,
        repo,
        pull_number
    });

    const result = determineComplexity(
        files.map((file) => file.filename),
        files.length,
        files.reduce((total, file) => total + file.additions + file.deletions, 0),
        limitFileChanged,
        limitLinesChanged
    );

    return result;
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
