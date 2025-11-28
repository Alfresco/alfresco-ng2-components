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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { UserIconColumnComponent } from './user-icon-column.component';
import { NodeEntry } from '@alfresco/js-api';
import { UnitTestingUtils } from '@alfresco/adf-core';
import { DebugElement } from '@angular/core';

describe('UserIconColumnComponent', () => {
    let fixture: ComponentFixture<UserIconColumnComponent>;
    let component: UserIconColumnComponent;
    let testingUtils: UnitTestingUtils;
    const person = {
        firstName: 'fake',
        lastName: 'user',
        email: 'fake@test.com'
    };

    const group = {
        id: 'fake-id',
        displayName: 'fake authority'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(UserIconColumnComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();
    });

    describe('person initial', () => {
        const getInitials = (): string => testingUtils.getInnerTextByDataAutomationId('user-initials-image');

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
            expect(getInitials()).toContain('FU');
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
            expect(getInitials()).toContain('FU');
        });
    });

    describe('group initial', () => {
        const getGroupIcon = (): DebugElement => testingUtils.getByCSS('[id="group-icon"] .adf-group-icon');

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
            expect(getGroupIcon()).toBeDefined();
            expect(getGroupIcon().nativeElement.textContent).toContain('people_alt_outline');
            expect(testingUtils.getInnerTextByCSS('.cdk-visually-hidden')).toBe('USER_ICON.GROUP_ICON_ALT');
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
            expect(getGroupIcon()).toBeDefined();
            expect(getGroupIcon().nativeElement.textContent).toContain('people_alt_outline');
            expect(testingUtils.getInnerTextByCSS('.cdk-visually-hidden')).toBe('USER_ICON.GROUP_ICON_ALT');
        });
    });

    it('should render select icon', () => {
        component.selected = true;
        component.ngOnInit();
        fixture.detectChanges();
        expect(testingUtils.getByCSS('.adf-people-select-icon[svgIcon="selected"]')).toBeDefined();
        expect(testingUtils.getInnerTextByCSS('.cdk-visually-hidden')).toBe('USER_ICON.GROUP_USER_SELECTED_ALT');
        expect(component.isSelected).toBe(true);
    });
});
