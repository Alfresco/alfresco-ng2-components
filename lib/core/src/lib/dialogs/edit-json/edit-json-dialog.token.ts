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

import { InjectionToken, Type } from '@angular/core';
import { EditJsonDialogComponent } from './edit-json.dialog';

/**
 * InjectionToken for providing a custom JSON editor dialog component.
 *
 * By default, the standard EditJsonDialogComponent (with textarea) is used.
 * You can override this token to inject a custom component implementation,
 * such as one using Monaco Editor for syntax highlighting and enhanced editing.
 *
 * Example usage in your app configuration:
 * ```typescript
 * import { EDIT_JSON_DIALOG_COMPONENT } from '@alfresco/adf-core';
 * import { MyCustomEditJsonDialogComponent } from './my-custom-editor.component';
 *
 * bootstrapApplication(AppComponent, {
 *     providers: [
 *         { provide: EDIT_JSON_DIALOG_COMPONENT, useValue: MyCustomEditJsonDialogComponent }
 *     ]
 * });
 * ```
 */
export const EDIT_JSON_DIALOG_COMPONENT = new InjectionToken<Type<unknown>>('EDIT_JSON_DIALOG_COMPONENT', {
    providedIn: 'root',
    factory: () => EditJsonDialogComponent
});
