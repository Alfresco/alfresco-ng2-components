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

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * @param options schema
 * @returns Schematic rule for updating imports
 */
export function updateAlfrescoApiImports(options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        console.log(options, _context);
        return tree;
    };
}
