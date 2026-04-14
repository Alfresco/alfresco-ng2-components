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
import { UserNameColumnComponent } from './user-name-column.component';
import { NodeEntry } from '@alfresco/js-api';
import { UnitTestingUtils } from '@alfresco/adf-core';

describe('UserNameColumnComponent', () => {
    let fixture: ComponentFixture<UserNameColumnComponent>;
    let component: UserNameColumnComponent;
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

    const getUserName = (): string => testingUtils.getInnerTextByCSS('.adf-user-name-column');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [UserNameColumnComponent]
        });
        fixture = TestBed.createComponent(UserNameColumnComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();
    });

    describe('person name', () => {
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
            expect(getUserName()).toBe('fake user');
            expect(testingUtils.getInnerTextByCSS('.adf-user-email-column')).toBe('fake@test.com');
        });

        it('should render person value from node', (done) => {
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

            const subscription = component.displayText$.subscribe((fullName) => {
                if (fullName) {
                    expect(fullName).toBe('Fake User');
                    subscription.unsubscribe();
                    done();
                }
            });

            component.ngOnInit();
        });
    });

    describe('group name', () => {
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
            expect(getUserName()).toBe('fake authority');
        });

        it('should display group id when display name is not provided', () => {
            component.context = {
                row: {
                    obj: {
                        entry: {
                            group: { id: 'fake_group_id' }
                        }
                    }
                }
            };
            component.ngOnInit();
            fixture.detectChanges();
            expect(getUserName()).toBe('fake_group_id');
        });

        it('should render group for authorityId when authorityDisplayName is not provided', () => {
            component.context = {
                row: {
                    obj: {
                        authorityId: 'fake-id',
                        authorityDisplayName: null
                    }
                }
            };
            component.ngOnInit();
            fixture.detectChanges();
            expect(getUserName()).toBe('fake-id');
        });

        it('should render authority display name when provided', () => {
            component.context = {
                row: {
                    obj: {
                        authorityId: 'fake-id',
                        authorityDisplayName: 'Fake authority'
                    }
                }
            };
            component.ngOnInit();
            fixture.detectChanges();
            expect(getUserName()).toBe('Fake authority');
        });

        it('should render person value from node', () => {
            component.node = {
                entry: {
                    nodeType: 'cm:authorityContainer',
                    properties: {
                        'cm:authorityName': 'Fake authority'
                    }
                }
            } as NodeEntry;
            component.ngOnInit();
            fixture.detectChanges();
            expect(getUserName()).toBe('Fake authority');
        });
    });
});
