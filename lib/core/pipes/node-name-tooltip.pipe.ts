/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

    transform(node: NodeEntry): string {
        if (node) {
            return this.getNodeTooltip(node);
        }
        return null;
    }

    private containsLine(lines: string[], line: string): boolean {
        return lines.some((item: string) => {
            return item.toLowerCase() === line.toLowerCase();
        });
    }

    private removeDuplicateLines(lines: string[]): string[] {
        const reducer = (acc: string[], line: string): string[] => {
            if (!this.containsLine(acc, line)) { acc.push(line); }
            return acc;
        };

        return lines.reduce(reducer, []);
    }

    private getNodeTooltip(node: NodeEntry): string {
        if (!node || !node.entry) {
            return null;
        }

        const { entry: { properties, name } } = node;
        const lines = [ name ];

        if (properties) {
            const {
                'cm:title': title,
                'cm:description': description
            } = properties;

            if (title && description) {
                lines[0] = title;
                lines[1] = description;
            }

            if (title) {
                lines[1] = title;
            }

            if (description) {
                lines[1] = description;
            }
        }

        return this.removeDuplicateLines(lines).join(`\n`);
    }
}
