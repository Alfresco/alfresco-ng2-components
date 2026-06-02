/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/**
 * Report printer - formats and prints security findings to console.
 */

const SEPARATOR_CHAR = '=';
const WARNING_CHAR = '!';
const SEPARATOR_WIDTH = 70;

// ============================================================================
// FORMATTING
// ============================================================================

function createSeparator(char = SEPARATOR_CHAR) {
    return char.repeat(SEPARATOR_WIDTH);
}

function formatPackageIdentifier(packageName, packageVersion) {
    return `${packageName}@${packageVersion}`;
}

function formatFindingLine(finding) {
    const packageId = formatPackageIdentifier(finding.name, finding.version);
    return `  ❌ ${packageId}\n     ${finding.reason} (${finding.source})`;
}

// ============================================================================
// REPORT PRINTING
// ============================================================================

export function printMalwareWarning(findings) {
    console.error('\n' + createSeparator(WARNING_CHAR));
    console.error('🚨 WARNING: MALICIOUS PACKAGES DETECTED');
    console.error(createSeparator(WARNING_CHAR) + '\n');

    for (const finding of findings) {
        console.error(formatFindingLine(finding) + '\n');
    }

    console.error('Remove these packages immediately:');
    console.error('  pnpm remove <package-name>\n');
    console.error(createSeparator(WARNING_CHAR) + '\n');
}

export function printCommitBlockedWarning(findings) {
    console.error(createSeparator());
    console.error('🚨 MALICIOUS PACKAGES DETECTED - COMMIT BLOCKED');
    console.error(createSeparator() + '\n');

    for (const finding of findings) {
        console.error(formatFindingLine(finding) + '\n');
    }

    console.error('Remove these packages before committing:');
    console.error('  pnpm remove <package-name>\n');
    console.error(createSeparator() + '\n');
}

export function printInstallBlockedWarning(packageName, packageVersion, reason) {
    console.error(`\n❌ BLOCKED: ${formatPackageIdentifier(packageName, packageVersion)}`);
    console.error(`   ${reason}\n`);
}

export function printCheckingMessage(packageCount) {
    console.log(`\n🔍 Checking ${packageCount} packages against security databases...\n`);
}

export function printPackageClean(packageName, packageVersion) {
    console.log(`  📦 ${formatPackageIdentifier(packageName, packageVersion)}`);
    console.log(`     ✅ Clean\n`);
}

export function printAllPackagesClean() {
    console.log('✅ All new packages passed security checks\n');
}

export function printSecurityCheckHeader() {
    console.log('\n🔒 Checking packages against security databases...\n');
}
