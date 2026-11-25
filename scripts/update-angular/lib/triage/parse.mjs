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

import crypto from 'node:crypto';
import { ERROR_CLASSES, isTestFile } from './taxonomy.mjs';

const FILE_EXTENSIONS = 'ts|tsx|mts|cts|html|js|mjs|cjs|scss|css|json';
const COMPILER_LINE = new RegExp(
    String.raw`^\s*(?<file>[^\s:()][^:()]*?\.(?:${FILE_EXTENSIONS}))(?:\((?<line>\d+),(?<col>\d+)\)|:(?<line2>\d+):(?<col2>\d+))?\s*(?:-\s*|:\s*)error\s+(?<code>TS\d+|NG\d+):\s*(?<message>.*)$`
);
const COMPILER_WITHOUT_FILE = /^\s*(?:\.\s+\S+:\s*)?error\s+(?<code>TS\d+|NG\d+):\s*(?<message>.*)$/;
const ESBUILD_ERROR = /^\s*(?:✘|X|×)?\s*\[ERROR\]\s+(?:(?<code>TS\d+|NG\d+):\s*)?(?<message>.*?)(?:\s+\[plugin [^\]]+\])?\s*$/;
const ESBUILD_LOCATION = new RegExp(String.raw`^\s+(?<file>[^\s:]+\.(?:${FILE_EXTENSIONS})):(?<line>\d+):(?<col>\d+):\s*$`);
const ESLINT_FILE = new RegExp(String.raw`^(?<file>(?:/|[\w@.-]+/)\S*\.(?:${FILE_EXTENSIONS}))\s*$`);
const ESLINT_PROBLEM = /^\s+(?<line>\d+):(?<col>\d+)\s+error\s+(?<message>.+?)(?:\s{2,}(?<rule>[@\w][\w\-/@]*))?\s*$/;
const ESLINT_MISSING_RULE = /Definition for rule '(?<rule>[^']+)' was not found|Could not find "(?<name>[^"]+)" in plugin "(?<plugin>[^"]+)"/;
const ESLINT_CRASH = /Oops! Something went wrong!|ESLint couldn't find|TypeError: Key "rules"|ESLint configuration .* is invalid/;
const KARMA_FAILED = /^(?:Chrome|Firefox|Edge|Safari)[^)]*\)\s+(?<test>.+?)\s+FAILED\s*$/;
const KARMA_DETAIL = /^(?:\t|\s{2,})\s*(?<text>\S.*)$/;
const SPEC_FRAME = /(?<file>(?:[\w@.-]+\/)*[\w.-]+\.spec\.ts):(?<line>\d+):(?<col>\d+)/;
const SCHEMA_FAILED = /Schema validation failed/;
const SCHEMA_DETAIL = /must NOT have additional properties\s*\((?<option>[^)]+)\)|Unknown (?:argument|option)s?:?\s*'?(?<unknown>[\w-]+)'?/;
const OUT_OF_MEMORY = /JavaScript heap out of memory|\bENOMEM\b/;
const NETWORK = /\b(?:ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|ECONNREFUSED)\b|socket hang up/;
const PNPM_ERROR = /\b(?<code>ERR_PNPM_[A-Z_]+)\b/;
const NG_RUNTIME = /\b(?<code>NG0\d{3})\b/;
const ERROR_HINT = /\berror\b|\bERROR\b|✖|✘|\bFAILED\b|\bFAIL\b|\bException\b/;
const NOISE = [
    /^\s*>?\s*NX\s/,
    /Failed tasks:/,
    /^\s*-\s+[\w@/-]+:[\w-]+(?::[\w-]+)?\s*$/,
    /Executed \d+ of \d+/,
    /^\s*✖ \d+ problems?/,
    /^\s*\d+ errors?(?:,| and) \d+ warnings?/,
    /Compiling with Angular sources/,
    /ELIFECYCLE/,
    /Command failed with exit code/,
    /^\s*(?:Error:\s*)?Command failed:\s/,
    /^\s*(?:Errors found in the full log|End of the log)/,
    /\b0 errors?\b/,
    /^\s*Warning:/i,
    /\[WARNING\]/,
    /▲/
];
const DETAIL_LINES = 4;
const EXCERPT_LINES = 8;
const UNPARSED_GAP = 3;
const MAX_FIELD_CHARS = 400;

/**
 * Removes terminal colour codes from a text.
 * @param text text to clean
 * @returns text without escape sequences
 */
function stripAnsi(text) {
    return text.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
}

/**
 * Makes a path relative to the repository, so that the same failure gets the same file on every runner.
 * @param file path as printed by a tool
 * @param workspaceRoot absolute path of the checkout
 * @returns path relative to the repository
 */
export function normalizeFile(file, workspaceRoot = '') {
    if (!file) {
        return '';
    }
    let normalized = file.replaceAll('\\', '/');
    const root = workspaceRoot.replaceAll('\\', '/').replace(/\/?$/, '/');

    if (workspaceRoot && normalized.startsWith(root)) {
        normalized = normalized.slice(root.length);
    }
    normalized = normalized.replace(/^\/home\/runner\/work\/[^/]+\/[^/]+\//, '').replace(/^\.\//, '');

    return normalized;
}

/**
 * Shortens a field so that a huge message cannot blow up the report.
 * @param text field value
 * @returns text of at most MAX_FIELD_CHARS characters
 */
function limit(text) {
    const trimmed = (text ?? '').trim().replace(/\s+/g, ' ');
    return trimmed.length > MAX_FIELD_CHARS ? `${trimmed.slice(0, MAX_FIELD_CHARS)}…` : trimmed;
}

/**
 * Reads the symbol involved in a compiler error, and what the compiler suggests instead when it does.
 * @param code TS or NG error code
 * @param message error message
 * @returns symbol, owner (module or type) and suggestion, each possibly empty
 */
export function extractSymbol(code, message) {
    const patterns = {
        TS2305: /Module '"?(?<owner>[^"']+)"?' has no exported member '(?<symbol>[^']+)'/,
        TS2724: /'"?(?<owner>[^"']+)"?' has no exported member named '(?<symbol>[^']+)'\. Did you mean '(?<suggestion>[^']+)'/,
        TS2614: /Module '"?(?<owner>[^"']+)"?' has no exported member '(?<symbol>[^']+)'/,
        TS2459: /Module '"?(?<owner>[^"']+)"?' declares '(?<symbol>[^']+)' locally, but it is not exported/,
        TS2694: /Namespace '(?<owner>[^']+)' has no exported member '(?<symbol>[^']+)'/,
        TS2551: /Property '(?<symbol>[^']+)' does not exist on type '(?<owner>.+?)'\. Did you mean '(?<suggestion>[^']+)'/,
        TS2339: /Property '(?<symbol>[^']+)' does not exist on type '(?<owner>.+?)'\.?$/,
        TS2353: /'(?<symbol>[^']+)' does not exist in type '(?<owner>.+?)'/,
        TS2307: /Cannot find module '(?<symbol>[^']+)'/,
        NG8001: /'(?<symbol>[^']+)' is not a known element/,
        NG8002: /Can't bind to '(?<property>[^']+)' since it isn't a known property of '(?<owner>[^']+)'/,
        NG8004: /No pipe found with name '(?<symbol>[^']+)'/
    };
    const standalone = /(?:Component|Directive|Pipe) (?<symbol>\w+) is standalone, and cannot be declared in an NgModule/;
    const match = (patterns[code] ?? standalone).exec(message);
    const groups = match?.groups ?? {};

    if (code === 'NG8002' && match) {
        return { symbol: `${groups.owner}[${groups.property}]`, owner: groups.owner, property: groups.property, suggestion: '' };
    }

    return { symbol: groups.symbol ?? '', owner: groups.owner ?? '', suggestion: groups.suggestion ?? '' };
}

/**
 * Finds the error class of a compiler error from its code and message.
 * @param code TS or NG error code
 * @param message error message
 * @param details symbol details
 * @param config triage configuration, with the curated renames and moved modules
 * @returns error class
 */
export function compilerErrorClass(code, message, details, config) {
    const localPrefixes = config.localSelectorPrefixes ?? [];
    const isLocal = (name) => localPrefixes.some((prefix) => name.startsWith(prefix)) || !name.includes('-');
    const knownRename = (config.knownRenames ?? []).some(
        (rename) => rename.from === details.symbol && (!rename.module || rename.module === details.owner)
    );
    const knownMove = (config.knownModuleMoves ?? []).some((move) => move.from === details.symbol);
    const byCode = {
        TS2724: 'ts-renamed-export',
        TS2614: 'ts-renamed-export',
        TS2551: 'ts-renamed-member',
        TS2305: knownRename ? 'ts-renamed-export' : 'ts-removed-export',
        TS2459: 'ts-removed-export',
        TS2694: knownRename ? 'ts-renamed-export' : 'ts-removed-export',
        TS2339: knownRename ? 'ts-renamed-member' : 'ts-removed-member',
        TS2353: 'ts-removed-option',
        TS2307: knownMove ? 'ts-moved-module' : 'ts-missing-module',
        NG8001: isLocal(details.symbol) ? 'ng-unknown-element-local' : 'ng-unknown-element-external',
        NG8002: isLocal(details.owner ?? '') ? 'ng-unknown-property-local' : 'ng-unknown-property-external',
        NG8004: 'ng-missing-pipe',
        NG5002: 'ng-template-syntax',
        NG6008: 'ng-standalone-default',
        NG6009: 'ng-standalone-default'
    };
    const typeMismatch = [
        'TS2322',
        'TS2345',
        'TS2741',
        'TS2739',
        'TS2740',
        'TS2769',
        'TS2352',
        'TS2416',
        'TS2420',
        'TS2564',
        'TS2531',
        'TS2532',
        'TS2533',
        'TS18046',
        'TS18047',
        'TS18048',
        'TS18049',
        'TS7006',
        'TS7053',
        'TS2366',
        'TS2355',
        'TS4113',
        'TS4114',
        'TS2729',
        'TS2698',
        'TS2349',
        'TS2344',
        'TS2314',
        'TS2315',
        'TS2589',
        'TS2367',
        'TS2362',
        'TS2363',
        'TS2365',
        'TS2538',
        'TS2571'
    ];
    const signature = ['TS2554', 'TS2555', 'TS2556', 'TS2559', 'TS2575', 'TS2558', 'TS2350', 'TS2351'];

    if (byCode[code]) {
        return byCode[code];
    }
    if (/is standalone, and cannot be declared in an NgModule/.test(message)) {
        return 'ng-standalone-default';
    }
    if (typeMismatch.includes(code)) {
        return 'ts-type-mismatch';
    }
    if (signature.includes(code)) {
        return 'ts-signature-change';
    }
    if (/^NG5\d{3}$/.test(code)) {
        return 'ng-template-syntax';
    }

    return code.startsWith('NG') ? 'ng-template-other' : 'ts-other';
}

/**
 * Builds a failure record and its fingerprint. The fingerprint leaves out the step and the line, so that the same failure
 * reported by several steps, or moved by an unrelated edit, is recognised as the same one.
 * @param fields fields of the record
 * @returns failure record
 */
export function createRecord(fields) {
    const errorClass = fields.errorClass;
    const baseCategory = ERROR_CLASSES[errorClass]?.category ?? 'unclassified';
    const testOnly = isTestFile(fields.file) && ['typescript-type', 'renamed-removed-api', 'template'].includes(baseCategory);
    const record = {
        step: fields.step,
        parser: fields.parser,
        file: fields.file ?? '',
        line: fields.line ?? 0,
        column: fields.column ?? 0,
        symbol: limit(fields.symbol),
        owner: limit(fields.owner),
        suggestion: limit(fields.suggestion),
        code: fields.code ?? '',
        message: limit(fields.message),
        errorClass,
        category: testOnly ? 'test-only' : baseCategory,
        excerpt: (fields.excerpt ?? []).map((line) => line.slice(0, 300))
    };
    const identity = [record.errorClass, record.code, record.file, record.symbol, record.message.replace(/\d+/g, 'N')].join('\u0000');
    record.fingerprint = crypto.createHash('sha256').update(identity).digest('hex').slice(0, 12);

    return record;
}

/**
 * Takes the lines of a failure from its first line up to the next failure, without trailing blank lines.
 * @param lines all lines
 * @param start index of the first line of the failure
 * @returns excerpt lines
 */
function excerptFrom(lines, start) {
    const excerpt = [lines[start]];
    for (let index = start + 1; index < lines.length && excerpt.length < EXCERPT_LINES; index++) {
        if ([COMPILER_LINE, ESBUILD_ERROR, KARMA_FAILED].some((pattern) => pattern.test(lines[index]))) {
            break;
        }
        excerpt.push(lines[index]);
    }
    while (excerpt.length > 1 && !excerpt.at(-1).trim()) {
        excerpt.pop();
    }
    return excerpt;
}

/**
 * Reads the lines that follow a compiler error and continue its message.
 * @param lines all lines
 * @param start index of the error line
 * @returns continuation lines
 */
function continuation(lines, start) {
    const result = [];
    for (let index = start + 1; index < lines.length && result.length < DETAIL_LINES; index++) {
        const line = lines[index];
        if (!/^\s{2,}\S/.test(line) || /^\s*\d+\s/.test(line) || /^\s*~+\s*$/.test(line) || COMPILER_LINE.test(line)) {
            break;
        }
        result.push(line.trim());
    }
    return result;
}

/**
 * Parses errors printed by tsc, ngc and ng-packagr: `file.ts:1:2 - error TS2305: message` or `file.ts(1,2): error TS2305: message`.
 * @param context parsing context
 */
function parseCompilerLines(context) {
    const { lines, consumed, records, step, workspaceRoot, config } = context;

    lines.forEach((line, index) => {
        const match = COMPILER_LINE.exec(line) ?? COMPILER_WITHOUT_FILE.exec(line);
        if (!match || consumed.has(index)) {
            return;
        }
        const { groups } = match;
        const extra = continuation(lines, index);
        const message = [groups.message, ...extra].join(' ');
        const details = extractSymbol(groups.code, groups.message);
        consumed.add(index);
        extra.forEach((_, offset) => consumed.add(index + offset + 1));
        records.push(
            createRecord({
                step,
                parser: 'compiler',
                file: normalizeFile(groups.file, workspaceRoot),
                line: Number(groups.line ?? groups.line2 ?? 0),
                column: Number(groups.col ?? groups.col2 ?? 0),
                code: groups.code,
                message,
                ...details,
                errorClass: compilerErrorClass(groups.code, groups.message, details, config),
                excerpt: excerptFrom(lines, index)
            })
        );
    });
}

/**
 * Parses errors printed by esbuild through the Angular application and karma builders: an `[ERROR]` line followed by the location.
 * @param context parsing context
 */
function parseEsbuildErrors(context) {
    const { lines, consumed, records, step, workspaceRoot, config } = context;

    lines.forEach((line, index) => {
        const match = ESBUILD_ERROR.exec(line);
        if (!match || consumed.has(index)) {
            return;
        }
        const { code = '', message } = match.groups;
        const locationIndex = lines.slice(index + 1, index + 7).findIndex((candidate) => ESBUILD_LOCATION.test(candidate));
        const location = locationIndex >= 0 ? ESBUILD_LOCATION.exec(lines[index + 1 + locationIndex]).groups : {};
        const unresolved = /Could not resolve "(?<module>[^"]+)"/.exec(message);

        if (!code && !unresolved) {
            return;
        }
        consumed.add(index);
        if (locationIndex >= 0) {
            consumed.add(index + 1 + locationIndex);
        }
        const effectiveCode = code || 'TS2307';
        const details = unresolved ? { symbol: unresolved.groups.module, owner: '', suggestion: '' } : extractSymbol(effectiveCode, message);
        records.push(
            createRecord({
                step,
                parser: 'esbuild',
                file: normalizeFile(location.file, workspaceRoot),
                line: Number(location.line ?? 0),
                column: Number(location.col ?? 0),
                code: code || 'esbuild',
                message,
                ...details,
                errorClass: compilerErrorClass(effectiveCode, message, details, config),
                excerpt: excerptFrom(lines, index)
            })
        );
    });
}

/**
 * Parses the stylish output of ESLint: a file path line followed by indented problems, and the errors of ESLint itself.
 * @param context parsing context
 */
function parseEslint(context) {
    const { lines, consumed, records, step, workspaceRoot } = context;
    let currentFile = '';

    lines.forEach((line, index) => {
        if (consumed.has(index)) {
            return;
        }
        const fileMatch = ESLINT_FILE.exec(line);
        if (fileMatch) {
            currentFile = normalizeFile(fileMatch.groups.file, workspaceRoot);
            return;
        }
        const missingRule = ESLINT_MISSING_RULE.exec(line);
        if (missingRule) {
            const rule = missingRule.groups.rule ?? `${missingRule.groups.plugin}/${missingRule.groups.name}`;
            consumed.add(index);
            records.push(
                createRecord({
                    step,
                    parser: 'eslint',
                    file: currentFile,
                    code: 'eslint-config',
                    symbol: rule,
                    message: line.trim(),
                    errorClass: 'lint-rule-missing',
                    excerpt: lines.slice(index, index + 3)
                })
            );
            return;
        }
        const problem = currentFile ? ESLINT_PROBLEM.exec(line) : null;
        if (problem) {
            consumed.add(index);
            const rule = problem.groups.rule ?? '';
            records.push(
                createRecord({
                    step,
                    parser: 'eslint',
                    file: currentFile,
                    line: Number(problem.groups.line),
                    column: Number(problem.groups.col),
                    code: rule || 'eslint',
                    symbol: rule,
                    message: problem.groups.message,
                    errorClass: 'lint-rule-violation',
                    excerpt: [currentFile, line]
                })
            );
            return;
        }
        if (ESLINT_CRASH.test(line)) {
            consumed.add(index);
            records.push(
                createRecord({
                    step,
                    parser: 'eslint',
                    code: 'eslint-crash',
                    message: [line, ...lines.slice(index + 1, index + 3)].join(' '),
                    errorClass: 'lint-crash',
                    excerpt: excerptFrom(lines, index)
                })
            );
        }
        if (!/^\s/.test(line) && line.trim()) {
            currentFile = '';
        }
    });
}

/**
 * Parses the failed specs reported by karma, with the first error line and the spec file of the stack trace.
 * @param context parsing context
 */
function parseKarma(context) {
    const { lines, consumed, records, step, workspaceRoot } = context;

    lines.forEach((line, index) => {
        const match = KARMA_FAILED.exec(line);
        if (!match || consumed.has(index)) {
            return;
        }
        consumed.add(index);
        const details = [];
        for (let next = index + 1; next < lines.length && KARMA_DETAIL.test(lines[next]); next++) {
            consumed.add(next);
            details.push(lines[next].trim());
        }
        const message = details.find((text) => !text.startsWith('at ')) ?? 'Spec failed';
        const frame = details.map((text) => SPEC_FRAME.exec(text)).find(Boolean)?.groups ?? {};
        const runtime = NG_RUNTIME.exec(message);
        records.push(
            createRecord({
                step,
                parser: 'karma',
                file: normalizeFile(frame.file, workspaceRoot),
                line: Number(frame.line ?? 0),
                column: Number(frame.col ?? 0),
                code: runtime ? runtime.groups.code : 'spec',
                symbol: runtime ? runtime.groups.code : '',
                owner: match.groups.test,
                message: `${match.groups.test}: ${message}`,
                errorClass: runtime ? 'ng-runtime' : 'test-assertion',
                excerpt: [line, ...details].slice(0, EXCERPT_LINES)
            })
        );
    });
}

/**
 * Parses builder and schematic option errors, and failures of the runner, the network or the package manager.
 * @param context parsing context
 */
function parseToolingErrors(context) {
    const { lines, consumed, records, step } = context;

    lines.forEach((line, index) => {
        if (consumed.has(index)) {
            return;
        }
        const add = (fields) => {
            consumed.add(index);
            records.push(createRecord({ step, excerpt: excerptFrom(lines, index), message: line, ...fields }));
        };
        const schemaDetail = SCHEMA_DETAIL.exec(line);

        if (schemaDetail) {
            add({
                parser: 'builder',
                code: 'schema',
                symbol: schemaDetail.groups.option ?? schemaDetail.groups.unknown,
                errorClass: 'builder-schema'
            });
        } else if (SCHEMA_FAILED.test(line)) {
            consumed.add(index);
        } else if (OUT_OF_MEMORY.test(line)) {
            add({ parser: 'runner', code: 'oom', errorClass: 'infra-out-of-memory' });
        } else if (NETWORK.test(line)) {
            add({ parser: 'runner', code: 'network', symbol: NETWORK.exec(line)[0], errorClass: 'infra-network' });
        } else if (PNPM_ERROR.test(line)) {
            add({
                parser: 'pnpm',
                code: PNPM_ERROR.exec(line).groups.code,
                symbol: PNPM_ERROR.exec(line).groups.code,
                errorClass: 'infra-package-manager'
            });
        }
    });
}

/**
 * Groups the error lines that no parser understood into chunks of neighbouring lines, one unparsed record per chunk.
 * @param context parsing context
 */
function collectUnparsed(context) {
    const { lines, consumed, records, step } = context;
    const indexes = lines
        .map((line, index) => index)
        .filter((index) => !consumed.has(index) && ERROR_HINT.test(lines[index]) && !NOISE.some((noise) => noise.test(lines[index])));
    const chunks = [];

    indexes.forEach((index) => {
        const last = chunks.at(-1);
        if (last && index - last.at(-1) <= UNPARSED_GAP) {
            last.push(index);
        } else {
            chunks.push([index]);
        }
    });

    chunks.forEach((chunk) => {
        const first = chunk[0];
        records.push(
            createRecord({
                step,
                parser: 'unparsed',
                code: 'unparsed',
                message: lines[first].trim(),
                errorClass: 'unparsed',
                excerpt: lines.slice(Math.max(0, first - 2), Math.min(lines.length, chunk.at(-1) + 3)).slice(0, EXCERPT_LINES * 2)
            })
        );
    });
}

/**
 * Parses the log of a step into structured failure records. Parsers run from the most specific output shape to the least,
 * each one marking the lines it understood; what is left with an error marker becomes an unparsed record.
 * @param step name of the step
 * @param log output of the step
 * @param options workspace root and triage configuration
 * @returns failure records, grouped by the parser that recognised them
 */
export function parseLog(step, log, options = {}) {
    const context = {
        step,
        lines: stripAnsi(log ?? '').split(/\r?\n/),
        consumed: new Set(),
        records: [],
        workspaceRoot: options.workspaceRoot ?? '',
        config: options.config ?? {}
    };

    parseCompilerLines(context);
    parseEsbuildErrors(context);
    parseKarma(context);
    parseEslint(context);
    parseToolingErrors(context);
    collectUnparsed(context);

    return context.records;
}
