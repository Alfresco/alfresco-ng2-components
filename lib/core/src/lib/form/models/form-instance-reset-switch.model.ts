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

import type { Signal } from '@angular/core';

let connectedSwitch: Signal<boolean> | undefined;

/**
 * Reports whether the host enabled form instance reset, for form models that cannot use dependency injection.
 *
 * @returns Whether the connected host switch is on; false while no switch is connected
 */
export function isFormInstanceResetEnabled(): boolean {
    return connectedSwitch?.() ?? false;
}

/**
 * Connects the host switch read by form models.
 *
 * @param enabled Host switch resolved from dependency injection
 * @returns Disconnects this switch if it is still the connected one
 */
export function connectFormInstanceResetSwitch(enabled: Signal<boolean>): () => void {
    connectedSwitch = enabled;
    return () => {
        if (connectedSwitch === enabled) {
            connectedSwitch = undefined;
        }
    };
}
