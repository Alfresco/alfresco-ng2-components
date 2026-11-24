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

import fs from 'node:fs';
import process from 'node:process';
import { main } from './lib/cli.mjs';

const COMMAND_PATTERN = /^\/update-angular(?=\s|$)\s*(\S*)/i;
const BRANCH_PATTERN = /^chore\/update-angular-\d+\.\d+\.\d+$/;
const COMMANDS = ['approve', 'help'];
const ROLES_WITH_WRITE_ACCESS = ['admin', 'maintain', 'write'];
const FEEDBACK_MARKER = '<!-- update-angular-feedback -->';
const USAGE = [
    '| Command | What it does |',
    '| --- | --- |',
    '| `/update-angular approve` | Approves the changes proposed for this pull request. |',
    '| `/update-angular help` | Shows this message. |'
].join('\n');

/**
 * Reads the command of a comment: the word after `/update-angular` on its first non-empty line.
 * @param body comment text
 * @returns the command in lower case, an empty text when only `/update-angular` was written, or undefined when the comment holds no command
 */
function parseCommand(body) {
    const firstLine = body
        .split('\n')
        .map((line) => line.trim())
        .find(Boolean);
    const match = firstLine?.match(COMMAND_PATTERN);

    return match ? match[1].toLowerCase() : undefined;
}

/**
 * Decides whether a command is accepted. The commenter is checked first, so that people without access learn nothing else.
 * @param situation the command, the role of the commenter and what the pull request is
 * @returns `accepted`, or `rejected` with the reason to show
 */
function decide(situation) {
    const { command, role, state, headRef, headRepository, repository } = situation;
    const rejected = (reason) => ({ verdict: 'rejected', reason });

    if (!ROLES_WITH_WRITE_ACCESS.includes(role)) {
        return rejected('Only people with write access to the repository can use this command.');
    }
    if (state !== 'open') {
        return rejected('This pull request is not open.');
    }
    if (headRepository !== repository) {
        return rejected('This pull request comes from a fork, only pull requests opened by the update workflow are handled.');
    }
    if (!BRANCH_PATTERN.test(headRef)) {
        return rejected('This is not a pull request opened by the update workflow: its branch is not `chore/update-angular-<version>`.');
    }
    if (!COMMANDS.includes(command)) {
        return rejected(command ? `\`${command}\` is not a command.` : 'No command was given.');
    }

    return { verdict: 'accepted' };
}

/**
 * Builds the reply posted on the pull request.
 * @param decision the verdict, and the reason when rejected
 * @param situation the command, who wrote it and the commit the pull request was at
 * @returns markdown
 */
function buildReply(decision, situation) {
    const { command, commenter, headSha } = situation;

    if (decision.verdict === 'rejected') {
        return `${FEEDBACK_MARKER}\n### ⚠️ Command not accepted\n\n${decision.reason}\n\n${USAGE}\n`;
    }
    if (command === 'help') {
        return `${FEEDBACK_MARKER}\n### ℹ️ Update Angular and Nx\n\n${USAGE}\n`;
    }

    return [
        FEEDBACK_MARKER,
        '### 👍 Approval received',
        `@${commenter} approved the changes proposed for \`${headSha.slice(0, 10)}\`.`,
        'Resolving them automatically is not available yet, so nothing was changed. This comment records the approval, and it only applies to this commit.',
        `<!-- update-angular-approval sha=${headSha} by=${commenter} -->`,
        ''
    ].join('\n\n');
}

/**
 * Handles a comment on a pull request: decides whether its command is accepted and writes the reply.
 * A comment that only looks like a command, such as `/update-angular-foo`, is ignored without a reply.
 * Everything comes from environment variables, so the comment text never goes through a shell.
 * @param replyFile file receiving the reply markdown, not written when the comment is ignored
 */
function handleFeedbackComment(replyFile) {
    const env = (name) => process.env[name] ?? '';
    const command = parseCommand(env('COMMENT_BODY'));
    const situation = {
        command: command ?? '',
        commenter: env('COMMENTER'),
        role: env('COMMENTER_ROLE'),
        state: env('PR_STATE'),
        headRef: env('PR_HEAD_REF'),
        headRepository: env('PR_HEAD_REPOSITORY'),
        headSha: env('PR_HEAD_SHA'),
        repository: env('REPOSITORY')
    };
    const decision = command === undefined ? { verdict: 'ignored' } : decide(situation);

    if (decision.verdict !== 'ignored') {
        fs.writeFileSync(replyFile, buildReply(decision, situation));
    }
    process.stdout.write(decision.verdict);
}

main(handleFeedbackComment);
