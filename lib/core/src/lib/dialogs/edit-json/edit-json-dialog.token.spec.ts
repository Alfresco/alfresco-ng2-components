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

import { TestBed } from '@angular/core/testing';
import { EDIT_JSON_DIALOG_COMPONENT } from './edit-json-dialog.token';
import { EditJsonDialogComponent } from './edit-json.dialog';

describe('EDIT_JSON_DIALOG_COMPONENT token', () => {
    it('should provide EditJsonDialogComponent by default', () => {
        TestBed.configureTestingModule({
            imports: [EditJsonDialogComponent]
        });

        const component = TestBed.inject(EDIT_JSON_DIALOG_COMPONENT);
        expect(component).toBe(EditJsonDialogComponent);
    });

    it('should allow overriding with a custom component', () => {
        class CustomEditJsonDialogComponent {}

        TestBed.configureTestingModule({
            imports: [EditJsonDialogComponent],
            providers: [{ provide: EDIT_JSON_DIALOG_COMPONENT, useValue: CustomEditJsonDialogComponent }]
        });

        const component = TestBed.inject(EDIT_JSON_DIALOG_COMPONENT);
        expect(component).toBe(CustomEditJsonDialogComponent);
    });

    it('should be available in root injector', () => {
        TestBed.configureTestingModule({
            imports: [EditJsonDialogComponent]
        });

        expect(TestBed.inject(EDIT_JSON_DIALOG_COMPONENT)).toBeDefined();
    });
});
