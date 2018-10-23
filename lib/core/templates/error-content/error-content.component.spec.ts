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

import { TestBed, async } from '@angular/core/testing';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { ErrorContentComponent } from './error-content.component';
import { TranslationService } from '../../services/translation.service';
import { TranslationMock } from '../../mock/translation.service.mock';
import { setupTestBed } from '../../testing/setupTestBed';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ErrorContentComponent', () => {

    let fixture;
    let errorContentComponent: ErrorContentComponent;
    let element: HTMLElement;
    let translateService: TranslationService;

    setupTestBed({
        imports: [
            CoreTestingModule
        ],
        providers: [
            { provide: TranslationService, useClass: TranslationMock },
            { provide: ActivatedRoute, useValue: { params: of({id: '404'})}}
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorContentComponent);
        element = fixture.nativeElement;
        errorContentComponent = <ErrorContentComponent> fixture.debugElement.componentInstance;
        translateService = TestBed.get(TranslationService);
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should create error component', async(() => {
        fixture.detectChanges();
        expect(errorContentComponent).toBeTruthy();
    }));

    it('should render error code', async(() => {
        fixture.detectChanges();
        const errorContentElement = element.querySelector('.adf-error-content-code');
        expect(errorContentElement).not.toBeNull();
        expect(errorContentElement).toBeDefined();
    }));

    it('should render error title', async(() => {
        fixture.detectChanges();
        const errorContentElement = element.querySelector('.adf-error-content-title');
        expect(errorContentElement).not.toBeNull();
        expect(errorContentElement).toBeDefined();
    }));

    it('should render error description', async(() => {
        fixture.detectChanges();
        const errorContentElement = element.querySelector('.adf-error-content-description');
        expect(errorContentElement).not.toBeNull();
        expect(errorContentElement).toBeDefined();
    }));

    it('should render error description', async(() => {
        fixture.detectChanges();
        const errorContentElement = element.querySelector('.adf-error-content-description');
        expect(errorContentElement).not.toBeNull();
        expect(errorContentElement).toBeDefined();
    }));

    it('should hide secondary button if this one has no value', async(() => {
        spyOn(translateService, 'instant').and.callFake((inputString) => {
            return '';
        });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const errorContentElement = element.querySelector('.adf-error-content-description-link');
            expect(errorContentElement).toBeNull();
        });
    }));

    it('should render secondary button with its value from the translate file', async(() => {
        spyOn(translateService, 'instant').and.callFake((inputString) => {
            return 'Secondary Button';
        });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const errorContentElement = element.querySelector('#adf-secondary-button');
            expect(errorContentElement).not.toBeNull();
            expect(errorContentElement).toBeDefined();
            expect(errorContentElement.textContent).toContain('ERROR_CONTENT.UNKNOWN.SECONDARY_BUTTON.TEXT');

        });
    }));

    it('should the default value of return button be /', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(errorContentComponent.returnButtonUrl).toBe('/');
        });
    }));

    it('should navigate to an error given by the route params', async(() => {
        spyOn(translateService, 'get').and.returnValue(of('404'));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(errorContentComponent.errorCode).toBe('404');
        });
    }));

    it('should navigate to the default error UNKNOWN if it does not find the error', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(errorContentComponent.errorCode).toBe('UNKNOWN');
        });
    }));

});
