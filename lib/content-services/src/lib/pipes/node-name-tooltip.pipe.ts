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

import { Pipe, PipeTransform } from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';

@Pipe({
    name: 'adfNodeNameTooltip'
})
export class NodeNameTooltipPipe implements PipeTransform {
    transform(node: NodeEntry): string | null {
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

    private removeDuplicates(lines: string[]): string[] {
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
