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

export const AUTO_FIXABLE = 'auto-fixable';
export const ESCALATE = 'escalate';
export const BLOCKED = 'blocked';

/**
 * Categories of migration failures, each with the classification it gets when no more specific rule applies.
 */
export const CATEGORIES = {
    'typescript-type': {
        title: 'TypeScript type errors',
        defaultClassification: AUTO_FIXABLE,
        why: 'Type mismatches after an upgrade usually follow stricter or changed signatures and have one mechanical fix.'
    },
    'renamed-removed-api': {
        title: 'Renamed and removed APIs',
        defaultClassification: ESCALATE,
        why: 'A removed API has no direct equivalent, so someone has to choose the replacement. Renames with a known target are auto-fixable.'
    },
    'schematic-default': {
        title: 'Changed schematic and builder defaults',
        defaultClassification: ESCALATE,
        why: 'A changed default asks for an opt-in or opt-out decision that shapes the code base.'
    },
    template: {
        title: 'Template compilation errors',
        defaultClassification: AUTO_FIXABLE,
        why: 'Most template errors after an upgrade are missing imports or syntax updates with a single fix.'
    },
    'test-only': {
        title: 'Test-only failures',
        defaultClassification: AUTO_FIXABLE,
        why: 'Failures confined to test code that compile against changed APIs do not change the shipped behaviour.'
    },
    lint: {
        title: 'Lint rule changes',
        defaultClassification: AUTO_FIXABLE,
        why: 'Rule violations are fixed by following the rule. Removed or renamed rules need a configuration decision.'
    },
    'behavioural-runtime': {
        title: 'Behavioural and runtime changes',
        defaultClassification: ESCALATE,
        why: 'A behaviour change has several valid resolutions: adapt the code, adapt the expectation, or restore the old behaviour.'
    },
    infrastructure: {
        title: 'Pipeline and infrastructure failures',
        defaultClassification: BLOCKED,
        why: 'The validation could not run, so nothing after it can be attributed to the migration.'
    },
    unclassified: {
        title: 'Unclassified failures',
        defaultClassification: ESCALATE,
        why: 'The output could not be parsed reliably. A misparsed failure is misclassified, so a human looks at it.'
    }
};

/**
 * Error classes: the shape of a failure. Each belongs to a category.
 */
export const ERROR_CLASSES = {
    'ts-renamed-export': { category: 'renamed-removed-api', title: 'Renamed export or changed import' },
    'ts-renamed-member': { category: 'renamed-removed-api', title: 'Renamed member' },
    'ts-moved-module': { category: 'renamed-removed-api', title: 'Changed import path' },
    'ts-removed-export': { category: 'renamed-removed-api', title: 'Removed export' },
    'ts-removed-member': { category: 'renamed-removed-api', title: 'Removed or unknown member' },
    'ts-removed-option': { category: 'renamed-removed-api', title: 'Removed option' },
    'ts-missing-module': { category: 'renamed-removed-api', title: 'Missing module or entry point' },
    'ts-type-mismatch': { category: 'typescript-type', title: 'Type mismatch' },
    'ts-signature-change': { category: 'typescript-type', title: 'Changed call signature' },
    'ts-other': { category: 'typescript-type', title: 'Other TypeScript error' },
    'ng-standalone-default': { category: 'schematic-default', title: 'Standalone default changed' },
    'builder-schema': { category: 'schematic-default', title: 'Builder or schematic option changed' },
    'ng-unknown-element-local': { category: 'template', title: 'Unknown repository element' },
    'ng-unknown-element-external': { category: 'template', title: 'Unknown library element' },
    'ng-unknown-property-local': { category: 'template', title: 'Unknown binding on a repository or native element' },
    'ng-unknown-property-external': { category: 'template', title: 'Unknown binding on a library element' },
    'ng-missing-pipe': { category: 'template', title: 'Missing pipe' },
    'ng-template-syntax': { category: 'template', title: 'Template syntax error' },
    'ng-template-other': { category: 'template', title: 'Other template error' },
    'test-assertion': { category: 'behavioural-runtime', title: 'Failing test expectation' },
    'ng-runtime': { category: 'behavioural-runtime', title: 'Angular runtime error' },
    'lint-rule-violation': { category: 'lint', title: 'Lint rule violation' },
    'lint-rule-missing': { category: 'lint', title: 'Removed or renamed lint rule' },
    'lint-crash': { category: 'infrastructure', title: 'Linter could not run' },
    'infra-out-of-memory': { category: 'infrastructure', title: 'Out of memory' },
    'infra-network': { category: 'infrastructure', title: 'Network failure' },
    'infra-package-manager': { category: 'infrastructure', title: 'Package manager failure' },
    'infra-cancelled': { category: 'infrastructure', title: 'Step cancelled or timed out' },
    'update-stage-failed': { category: 'infrastructure', title: 'Update stage failed' },
    unparsed: { category: 'unclassified', title: 'Output that resisted parsing' },
    'step-failed-without-errors': { category: 'unclassified', title: 'Step failed without a recognised error' }
};

/**
 * Options a human chooses between for each kind of escalation, with their trade-offs and the recommended one.
 */
export const PLAYBOOKS = {
    'removed-api': {
        why: 'The API used here no longer exists and the compiler offers no direct equivalent, so the replacement shapes the design.',
        options: [
            {
                name: 'Adopt the replacement API named in the upstream changelog or migration guide',
                tradeOffs: 'Aligned with upstream and future-proof; can need a refactor of the callers and a public API change for ADF consumers.'
            },
            {
                name: 'Add a local adapter that keeps the old contract on top of the new API',
                tradeOffs: 'Small diff and no breaking change for consumers; adds code to maintain and hides the upstream change.'
            },
            {
                name: 'Drop the feature or the usage',
                tradeOffs: 'Least code; a breaking change that needs an upgrade guide entry.'
            }
        ],
        recommendation: 0
    },
    'changed-default': {
        why: 'A default changed, and keeping or adopting it is an opt-in decision that applies to the whole code base.',
        options: [
            {
                name: 'Adopt the new default and migrate the affected code',
                tradeOffs: 'Matches upstream and new code; larger diff and review effort in this pull request.'
            },
            {
                name: 'Opt out explicitly to keep the current behaviour, and track the migration separately',
                tradeOffs: 'Minimal diff that unblocks the upgrade; technical debt, and the opt-out may be removed in a later major.'
            }
        ],
        recommendation: 1
    },
    behavioural: {
        why: 'The code compiles but behaves differently, and more than one resolution is valid.',
        options: [
            {
                name: 'Change the code to keep the previous behaviour',
                tradeOffs: 'No visible change for users; can fight the new upstream behaviour.'
            },
            {
                name: 'Accept the new behaviour and update the expectations',
                tradeOffs: 'Least code; a visible change for users that needs release notes.'
            },
            {
                name: 'Restore the previous behaviour through configuration or a provider, if upstream offers one',
                tradeOffs: 'Small and explicit; the configuration may be deprecated later.'
            }
        ],
        recommendation: 0
    },
    'lint-config': {
        why: 'A lint rule was removed or renamed, and the lint policy of the repository has to be decided.',
        options: [
            { name: 'Switch to the replacement rule', tradeOffs: 'Keeps the policy; may report new violations to fix.' },
            { name: 'Remove the rule from the configuration', tradeOffs: 'Simplest; loses the check.' },
            { name: 'Keep the previous plugin version for now', tradeOffs: 'No change in policy; blocks the plugin upgrade.' }
        ],
        recommendation: 0
    },
    'external-template': {
        why: 'A library element, binding or pipe is no longer known. It may only need an import, or the library may have removed it.',
        options: [
            { name: 'Import the standalone component, directive or module that provides it', tradeOffs: 'Mechanical, when it still exists.' },
            {
                name: 'Replace it with what superseded it',
                tradeOffs: 'Needed when it was removed; can change markup, styling and behaviour.'
            }
        ],
        recommendation: 0
    },
    uncertain: {
        why: 'The failure shape does not identify the fix with confidence, and the pipeline escalates when uncertain.',
        options: [
            {
                name: 'Treat it as mechanical and fix it in this pull request',
                tradeOffs: 'Fast; when it is a confirmed rename, add it to `knownRenames` in `triage-config.json` so it is auto-fixable next time.'
            },
            {
                name: 'Treat it as an API change and choose a replacement design',
                tradeOffs: 'Safe when the API was removed; more effort.'
            }
        ],
        recommendation: 0
    }
};

/**
 * Tells whether a file holds test code only.
 * @param file path of the file
 * @returns true for spec files and testing helpers
 */
export function isTestFile(file) {
    return /\.spec\.ts$|\.test\.ts$|(^|\/)(testing|test-helpers|__mocks__)\//.test(file ?? '');
}
