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

import { UnknownFormatComponent } from './unknown-format.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';

describe('Unknown Format Component', () => {
    let fixture: ComponentFixture<UnknownFormatComponent>;

    const getErrorMessageElement = (): string => fixture.debugElement.nativeElement.querySelector('.adf-viewer__unknown-label').innerText;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });
        fixture = TestBed.createComponent(UnknownFormatComponent);
        fixture.detectChanges();
    });

    it('should render default error message', () => {
        expect(getErrorMessageElement()).toBe('ADF_VIEWER.UNKNOWN_FORMAT');
    });

    it('should render custom error message if such provided', () => {
        const errorMessage = 'Custom error message';
        fixture.componentInstance.customError = errorMessage;

        fixture.detectChanges();
        expect(getErrorMessageElement()).toBe(errorMessage);
    });
});
