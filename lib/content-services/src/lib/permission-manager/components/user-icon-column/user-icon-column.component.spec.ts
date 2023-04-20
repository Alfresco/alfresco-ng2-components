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

import { setupTestBed } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { UserIconColumnComponent } from './user-icon-column.component';
import { NodeEntry } from '@alfresco/js-api';

describe('UserIconColumnComponent', () => {

    let fixture: ComponentFixture<UserIconColumnComponent>;
    let component: UserIconColumnComponent;
    let element: HTMLElement;
    const  person = {
        firstName: 'fake',
        lastName: 'user',
        email: 'fake@test.com'
    };

    const  group = {
        id: 'fake-id',
        displayName: 'fake authority'
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        fixture =  TestBed.createComponent(UserIconColumnComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('person initial', () => {
        it('should render person value from context', () => {
            component.context = {
                row: {
                    obj: {
                        person
                    }
                }
            };
            component.ngOnInit();
            fixture.detectChanges();
            expect(element.querySelector('[data-automation-id="user-initials-image"]').textContent).toContain('fu');
        });

        it('should render person value from node', () => {
            component.node = {
                entry: {
                    nodeType: 'cm:person',
                    properties: {
                     'cm:firstName': 'Fake',
                       'cm:lastName': 'User',
                        'cm:email': 'fake-user@test.com',
                        'cm:userName': 'fake-user'
                    }
                }
            } as NodeEntry;
            component.ngOnInit();
            fixture.detectChanges();
            expect(element.querySelector('[data-automation-id="user-initials-image"]').textContent).toContain('FU');
        });
    });

    describe('group initial', () => {
        it('should render group value from context', () => {
            component.context = {
                row: {
                    obj: {
                        group
                    }
                }
            };
            component.ngOnInit();
            fixture.detectChanges();
            expect(element.querySelector('[id="group-icon"] mat-icon')).toBeDefined();
            expect(element.querySelector('[id="group-icon"] mat-icon').textContent).toContain('people_alt_outline');
        });

        it('should render person value from node', () => {
            component.node = {
                entry: {
                    nodeType: 'cm:authorityContainer',
                    properties: {
                     'cm:authorityName': 'Fake authorityN'
                    }
                }
            } as NodeEntry;
            component.ngOnInit();
            fixture.detectChanges();
            expect(element.querySelector('[id="group-icon"] mat-icon')).toBeDefined();
            expect(element.querySelector('[id="group-icon"] mat-icon').textContent).toContain('people_alt_outline');
        });
    });

    it('should render select icon', () => {
        component.selected = true;
        component.ngOnInit();
        fixture.detectChanges();
        expect(element.querySelector('mat-icon[svgIcon="selected"]')).toBeDefined();
        expect(component.isSelected).toBe(true);
    });
});
