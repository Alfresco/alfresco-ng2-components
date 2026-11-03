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

const TRUNCATED_NOTE = '…truncated, see the workflow run summary for the full report';
const NOTE_ROOM_CHARS = 100;

/**
 * Wraps a text in a code fence that no line of the text can close: the fence is longer than any run of backticks inside it.
 * @param text text to fence, such as a log
 * @returns markdown
 */
export function fenced(text) {
    const longestRun = Math.max(0, ...(text.match(/`+/g) ?? []).map((run) => run.length));
    const fence = '`'.repeat(Math.max(3, longestRun + 1));

    return `${fence}\n${text}\n${fence}`;
}

/**
 * Shortens markdown to a number of characters, cutting at a line break and closing the collapsible blocks left open.
 * @param text markdown to shorten
 * @param limit maximum number of characters of the result
 * @returns the markdown, ending with a note when it was shortened
 */
export function truncateMarkdown(text, limit) {
    if (text.length <= limit) {
        return text;
    }

    const room = text.slice(0, Math.max(0, limit - TRUNCATED_NOTE.length - NOTE_ROOM_CHARS));
    const kept = room.slice(0, room.lastIndexOf('\n') + 1);
    const openBlocks = (kept.match(/<details/g) ?? []).length - (kept.match(/<\/details>/g) ?? []).length;

    return `${kept}${'</details>\n'.repeat(Math.max(0, openBlocks))}\n${TRUNCATED_NOTE}`;
}

/**
 * Fits several markdown texts into a budget. A text that is short enough is kept whole, and what it leaves unused goes to the longer ones.
 * @param texts markdown texts
 * @param budget total number of characters available
 * @returns the texts, shortened where needed
 */
export function shareBudget(texts, budget) {
    const caps = texts.map(() => 0);
    let remaining = budget;
    let open = texts.map((text, index) => index);

    while (open.length) {
        const share = Math.floor(remaining / open.length);
        const fitting = open.filter((index) => texts[index].length <= share);

        if (!fitting.length) {
            open.forEach((index) => (caps[index] = share));
            break;
        }
        fitting.forEach((index) => {
            caps[index] = texts[index].length;
            remaining -= texts[index].length;
        });
        open = open.filter((index) => !fitting.includes(index));
    }

    return texts.map((text, index) => truncateMarkdown(text, caps[index]));
}
