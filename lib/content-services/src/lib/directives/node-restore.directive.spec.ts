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

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NodeRestoreDirective } from './node-restore.directive';
import { TranslationService } from '@alfresco/adf-core';
import { TrashcanApi } from '@alfresco/js-api';

@Component({
    imports: [NodeRestoreDirective],
    template: ` <div [adf-restore]="selection" (restore)="doneSpy()"></div>`
})
class TestComponent {
    selection: any[] = [];

    doneSpy = jasmine.createSpy('doneSpy');
}

describe('NodeRestoreDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let component: TestComponent;
    let trashcanApi: TrashcanApi;
    let directiveInstance: NodeRestoreDirective;
    let restoreNodeSpy: any;
    let translationService: TranslationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent]
        });
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(NodeRestoreDirective));
        directiveInstance = element.injector.get(NodeRestoreDirective);

        trashcanApi = directiveInstance.trashcanApi;

        restoreNodeSpy = spyOn(trashcanApi, 'restoreDeletedNode').and.returnValue(Promise.resolve({} as any));
        spyOn(trashcanApi, 'listDeletedNodes').and.returnValue(
            Promise.resolve({
                list: { entries: [] }
            })
        );

        translationService = TestBed.inject(TranslationService);
        spyOn(translationService, 'instant').and.callFake((key) => key);
    });

    it('should not restore when selection is empty', () => {
        component.selection = [];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(trashcanApi.restoreDeletedNode).not.toHaveBeenCalled();
    });

    it('should not restore nodes when selection has nodes without path', (done) => {
        component.selection = [{ entry: { id: '1' } }];

        fixture.detectChanges();
        fixture.whenStable().then(() => {
            element.triggerEventHandler('click', null);

            expect(trashcanApi.restoreDeletedNode).not.toHaveBeenCalled();
            done();
        });
    });

    it('should call restore when selection has nodes with path', (done) => {
        component.selection = [{ entry: { id: '1', path: ['somewhere-over-the-rainbow'] } }];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);
        fixture.whenStable().then(() => {
            expect(trashcanApi.restoreDeletedNode).toHaveBeenCalled();
            done();
        });
    });

    describe('reset', () => {
        it('should reset selection', (done) => {
            component.selection = [{ entry: { id: '1', path: ['somewhere-over-the-rainbow'] } }];

            directiveInstance.restore.subscribe(() => {
                expect(directiveInstance.selection.length).toBe(0);
                done();
            });

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(directiveInstance.selection.length).toBe(1);
                element.triggerEventHandler('click', null);
            });
        });

        it('should emit event on finish', (done) => {
            spyOn(element.nativeElement, 'dispatchEvent');

            directiveInstance.restore.subscribe(() => {
                expect(component.doneSpy).toHaveBeenCalled();
                done();
            });

            component.selection = [{ entry: { id: '1', path: ['somewhere-over-the-rainbow'] } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
        });
    });

    describe('notification', () => {
        it('should notify on multiple fails', (done) => {
            const error = { message: '{ "error": {} }' };

            directiveInstance.restore.subscribe((event: any) => {
                expect(event.message).toEqual('CORE.RESTORE_NODE.PARTIAL_PLURAL');
                done();
            });

            restoreNodeSpy.and.callFake((id: string) => {
                if (id === '1') {
                    return Promise.resolve();
                }

                return Promise.reject(error);
            });

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } },
                { entry: { id: '2', name: 'name2', path: ['somewhere-over-the-rainbow'] } },
                { entry: { id: '3', name: 'name3', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
        });

        it('should notify fail when restored node exist, error 409', (done) => {
            const error = { message: '{ "error": { "statusCode": 409 } }' };

            directiveInstance.restore.subscribe((event) => {
                expect(event.message).toEqual('CORE.RESTORE_NODE.NODE_EXISTS');

                done();
            });

            restoreNodeSpy.and.returnValue(Promise.reject(error));

            component.selection = [{ entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
        });

        it('should notify fail when restored node returns different statusCode', (done) => {
            const error = { message: '{ "error": { "statusCode": 404 } }' };

            restoreNodeSpy.and.returnValue(Promise.reject(error));

            directiveInstance.restore.subscribe((event) => {
                expect(event.message).toEqual('CORE.RESTORE_NODE.GENERIC');

                done();
            });

            component.selection = [{ entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
        });

        it('should notify fail when restored node location is missing', (done) => {
            const error = { message: '{ "error": { } }' };

            restoreNodeSpy.and.returnValue(Promise.reject(error));

            directiveInstance.restore.subscribe((event: any) => {
                expect(event.message).toEqual('CORE.RESTORE_NODE.LOCATION_MISSING');
                done();
            });

            component.selection = [{ entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
        });

        it('should notify success when restore multiple nodes', (done) => {
            directiveInstance.restore.subscribe((event: any) => {
                expect(event.message).toEqual('CORE.RESTORE_NODE.PLURAL');

                done();
            });

            restoreNodeSpy.and.callFake(() => Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } },
                { entry: { id: '2', name: 'name2', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
        });

        it('should notify success on restore selected node', (done) => {
            directiveInstance.restore.subscribe((event) => {
                expect(event.message).toEqual('CORE.RESTORE_NODE.SINGULAR');

                done();
            });

            component.selection = [{ entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
        });
    });
});
