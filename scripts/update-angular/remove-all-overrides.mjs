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

import { main } from './lib/cli.mjs';
import { readOverrides, removeOverrides } from './lib/overrides.mjs';

/**
 * Removes every override from a pnpm-workspace.yaml, to resolve the dependencies the way they would be without them.
 * @param workspaceFile path of pnpm-workspace.yaml
 */
function removeAllOverrides(workspaceFile) {
    removeOverrides(
        workspaceFile,
        readOverrides(workspaceFile).map((override) => override.key)
    );
}

main(removeAllOverrides);
