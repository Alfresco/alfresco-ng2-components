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
import { UserNameColumnComponent } from './user-name-column.component';
import { NodeEntry } from '@alfresco/js-api';

describe('UserNameColumnComponent', () => {

    let fixture: ComponentFixture<UserNameColumnComponent>;
    let component: UserNameColumnComponent;
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
        fixture =  TestBed.createComponent(UserNameColumnComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
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
            expect(element.querySelector('[title="fake user"]').textContent).toContain('fake user');
            expect(element.querySelector('[title="fake@test.com"]').textContent).toContain('fake@test.com');
        });

        it('should render person value from node',  (done) => {
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
            expect(element.querySelector('[title="fake authority"]').textContent.trim()).toBe('fake authority');
        });

        it('should render group for authorityId', () => {
            component.context = {
                row: {
                    obj: {
                        authorityId: 'fake-id'
                    }
                }
            };
            component.ngOnInit();
            fixture.detectChanges();
            expect(element.querySelector('[title=fake-id]').textContent.trim()).toBe('fake-id');
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
            expect(element.querySelector('[title="Fake authority"]').textContent.trim()).toBe('Fake authority');
        });
    });
});
