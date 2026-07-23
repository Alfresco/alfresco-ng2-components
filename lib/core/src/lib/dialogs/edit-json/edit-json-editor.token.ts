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

import { InjectionToken, Type, WritableSignal } from '@angular/core';

/**
 * Contract for a pluggable JSON editor component.
 * The component receives these inputs and updates the value signal directly.
 */
export interface JsonEditorInputs extends Record<string, unknown> {
    value: WritableSignal<string>;
    readOnly: boolean;
}

/**
 * InjectionToken for swapping ONLY the editor control inside the JSON dialog.
 *
 * Default: `null` — the dialog uses the built-in textarea (backward-compatible).
 * Override: provide a component type that implements JsonEditorInputs.
 *
 * Example (Monaco editor):
 * ```typescript
 * export const provideMonacoJsonEditor = (): EnvironmentProviders =>
 *     makeEnvironmentProviders([
 *         { provide: EDIT_JSON_EDITOR, useValue: MonacoJsonEditorComponent }
 *     ]);
 * ```
 *
 * The custom editor component must:
 * - Accept `value: WritableSignal<string>` and `readOnly: boolean` as inputs
 * - Update the signal when the user makes changes: `value.set(newContent)`
 * - Respect the readOnly flag to disable editing
 */
export const EDIT_JSON_EDITOR = new InjectionToken<Type<unknown> | null>('EDIT_JSON_EDITOR', {
    providedIn: 'root',
    factory: () => null
});
