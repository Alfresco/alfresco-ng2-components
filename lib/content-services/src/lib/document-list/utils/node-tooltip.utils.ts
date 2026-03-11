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

import { NodeEntry } from '@alfresco/js-api';

/**
 * Utility class for generating node and library tooltips based on node properties
 */
export class NodeTooltipUtils {
    /**
     * Generates a tooltip string for a node based on its name, title, and description properties.
     * The tooltip logic follows these rules:
     * - If both title and description exist: shows "title\ndescription"
     * - If only title exists: shows "name\ntitle"
     * - If only description exists: shows "name\ndescription"
     * - If neither exists: shows "name"
     * - Removes case-insensitive duplicates while preserving order
     *
     * @param node - The node entry to generate tooltip for
     * @returns The tooltip string with newline-separated lines, or null if node is invalid
     */
    static getNodeTooltip(node: NodeEntry): string | null {
        if (!node?.entry) {
            return null;
        }

        const {
            entry: { properties, name }
        } = node;

        const title = properties?.['cm:title'];
        const description = properties?.['cm:description'];

        // Build lines array based on available properties
        const lines: string[] = [];

        // Determine first line: title if available and different from name, otherwise name
        if (title && description) {
            lines.push(title, description);
        } else if (title) {
            lines.push(name, title);
        } else if (description) {
            lines.push(name, description);
        } else {
            lines.push(name);
        }

        // Remove case-insensitive duplicates while preserving order
        return this.removeDuplicates(lines).join('\n');
    }

    /**
     * Generates a tooltip string for a library (site) node.
     * Returns description if available, otherwise title, otherwise empty string.
     *
     * @param node - The node entry to generate tooltip for
     * @returns The tooltip string, or empty string if no description or title is available
     */
    static getLibraryTooltip(node: NodeEntry): string {
        if (!node?.entry) {
            return '';
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { properties, description, title } = node.entry as any;

        // Check both direct properties and cm: properties for compatibility
        const desc = description || properties?.['cm:description'];
        const ttl = title || properties?.['cm:title'];

        return desc || ttl || '';
    }

    /**
     * Generates a display title for a library (site) node.
     * If there are duplicate titles in the list, appends the library ID/name in parentheses.
     *
     * @param library - The library entry object
     * @param allEntries - Array of all entries to check for duplicates
     * @returns The display title, with ID/name appended if duplicate exists
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static getLibraryTitle(library: any, allEntries: any[]): string {
        if (!library) {
            return '';
        }

        // Support both direct properties and cm: properties
        const libraryId = library.id;
        const libraryName = library.name;
        const libraryTitle = library.title || library.properties?.['cm:title'];

        if (!libraryTitle) {
            return libraryName || libraryId || '';
        }

        // Check if there are duplicate titles in the list
        let isDuplicate = false;

        if (allEntries && allEntries.length > 0) {
            isDuplicate = allEntries.some((entry) => {
                const entryId = entry.id;
                const entryTitle = entry.title || entry.properties?.['cm:title'];
                return entryId !== libraryId && entryTitle === libraryTitle;
            });
        }

        // If duplicate, append the ID or name in parentheses
        let suffix = libraryId;
        if (libraryName && libraryName !== libraryTitle) {
            suffix = libraryName;
        }
        return isDuplicate && suffix ? `${libraryTitle} (${suffix})` : libraryTitle;
    }

    /**
     * Removes case-insensitive duplicate strings from an array while preserving order
     *
     * @param lines - Array of strings to deduplicate
     * @returns Array with duplicates removed
     */
    private static removeDuplicates(lines: string[]): string[] {
        const seen = new Set<string>();
        return lines.filter((line) => {
            const lowerLine = line.toLowerCase();
            if (seen.has(lowerLine)) {
                return false;
            }
            seen.add(lowerLine);
            return true;
        });
    }
}
