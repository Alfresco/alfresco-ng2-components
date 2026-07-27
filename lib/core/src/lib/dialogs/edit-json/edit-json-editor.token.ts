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

import { InjectionToken, InputSignal, ModelSignal, Type } from '@angular/core';

/**
 * Contract for a pluggable JSON editor component.
 *
 * The component participates in a two-way binding for its content: the dialog binds
 * its own value to the `value` model, so user edits made inside the editor flow back
 * out automatically (no manual signal mutation across the component boundary).
 */
export interface JsonEditorComponent {
    /** Two-way bound JSON content. */
    value: ModelSignal<string>;
    /** Whether the editor is read-only. */
    readOnly: InputSignal<boolean>;
}

/**
 * InjectionToken for swapping ONLY the editor control inside the JSON dialog.
 *
 * Default: `null` — the dialog uses the built-in textarea (backward-compatible).
 * Override: provide a component type that implements JsonEditorComponent.
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
 * - Expose a two-way `value = model<string>()` for the JSON content
 * - Expose a `readOnly = input<boolean>()` and disable editing when it is `true`
 */
export const EDIT_JSON_EDITOR = new InjectionToken<Type<JsonEditorComponent> | null>('EDIT_JSON_EDITOR', {
    providedIn: 'root',
    factory: () => null
});
