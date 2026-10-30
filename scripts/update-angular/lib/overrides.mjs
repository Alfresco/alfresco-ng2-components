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

const OVERRIDE_LINE = /^ {2}(?:"([^"]+)"|'([^']+)'|([^\s"'#][^:]*)):\s*(?:"([^"]*)"|'([^']*)'|(\S+))\s*$/;

/**
 * Finds where the overrides block starts and ends in the lines of pnpm-workspace.yaml.
 * @param lines lines of the file
 * @returns first and last line index of the block, or undefined when there is none
 */
function findOverridesBlock(lines) {
    const start = lines.indexOf('overrides:');
    if (start === -1) {
        return undefined;
    }

    let end = start + 1;
    while (end < lines.length && (lines[end] === '' || /^\s/.test(lines[end]) || lines[end].startsWith('#'))) {
        end++;
    }

    return { start, end: end - 1 };
}

/**
 * Parses a line of the overrides block.
 * @param line line of pnpm-workspace.yaml
 * @returns the override key and target, or undefined for comments and blank lines
 */
function parseOverrideLine(line) {
    const match = line.match(OVERRIDE_LINE);
    return match ? { key: match[1] ?? match[2] ?? match[3], target: match[4] ?? match[5] ?? match[6] } : undefined;
}

/**
 * Reads the overrides of pnpm-workspace.yaml.
 * @param file path of pnpm-workspace.yaml
 * @returns overrides with their key (selector) and target
 */
export function readOverrides(file) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const block = findOverridesBlock(lines);

    return block
        ? lines
              .slice(block.start + 1, block.end + 1)
              .map(parseOverrideLine)
              .filter(Boolean)
        : [];
}

/**
 * Removes overrides from pnpm-workspace.yaml, together with the whole block when no override is left.
 * @param file path of pnpm-workspace.yaml
 * @param keys override keys to remove
 */
export function removeOverrides(file, keys) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    const block = findOverridesBlock(lines);

    if (!block) {
        return;
    }

    const keptLines = lines.slice(block.start + 1, block.end + 1).filter((line) => {
        const override = parseOverrideLine(line);
        return !override || !keys.includes(override.key);
    });
    const hasOverrides = keptLines.some((line) => parseOverrideLine(line));
    const newBlock = hasOverrides ? ['overrides:', ...keptLines] : [];

    fs.writeFileSync(file, [...lines.slice(0, block.start), ...newBlock, ...lines.slice(block.end + 1)].join('\n'));
}

/**
 * Splits an override key such as "parent@1>name@2" into the overridden package, its version range and its parent.
 * @param key override key
 * @returns name, range and parent name
 */
export function parseSelector(key) {
    const parts = key.split('>');
    const [, name, range] = parts.at(-1).match(/^(@?[^@]+)(?:@(.+))?$/);
    const parent = parts.length > 1 ? parts.at(-2).match(/^(@?[^@]+)/)[1] : undefined;

    return { name, range, parent };
}
