/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

/*tslint:disable:ban*/

import { TestBed, async } from '@angular/core/testing';
import { MaterialModule } from '../../material.module';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { ErrorContentComponent } from './error-content.component';

fdescribe('ButtonsMenuComponent', () => {

    let fixture;
    let errorContentComponent: ErrorContentComponent;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                CoreTestingModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorContentComponent);
        element = fixture.nativeElement;
        errorContentComponent = <ErrorContentComponent> fixture.debugElement.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should create error component', async(() => {
        expect(errorContentComponent).toBeTruthy();
    }));

    it('should render error code', async(() => {
        const errorContentElement = element.querySelector('.adf-error-content-code');
        expect(errorContentElement).not.toBeNull();
        expect(errorContentElement).toBeDefined();
    }));

    it('should render error title', async(() => {
        const errorContentElement = element.querySelector('.adf-error-content-title');
        expect(errorContentElement).not.toBeNull();
        expect(errorContentElement).toBeDefined();
    }));

    it('should render error description', async(() => {
        const errorContentElement = element.querySelector('.adf-error-content-description');
        expect(errorContentElement).not.toBeNull();
        expect(errorContentElement).toBeDefined();
    }));

    it('should render report issue links', async(() => {
        errorContentComponent.errorLinkUrl = '403';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const errorContentElement = element.querySelector('.adf-error-content-description-link');
            expect(errorContentElement).not.toBeNull();
            expect(errorContentElement).toBeDefined();
        });
    }));

});
