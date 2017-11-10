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

import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Rx';
import { TranslationService } from '../../index';
import { ServicesModule } from '../../index';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { NotificationService } from '../services/notification.service';
import { NodeRestoreDirective } from './node-restore.directive';

@Component({
    template: `
        <div [adf-restore]="selection"
             (restore)="done()">
        </div>`
})
class TestComponent {
    selection = [];

    done = jasmine.createSpy('done');
}

describe('NodeRestoreDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let component: TestComponent;
    let alfrescoService: AlfrescoApiService;
    let translation: TranslationService;
    let notification: NotificationService;
    let router: Router;
    let nodesService;
    let coreApi;
    let directiveInstance;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ServicesModule,
                RouterTestingModule
            ],
            declarations: [
                TestComponent
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(TestComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement.query(By.directive(NodeRestoreDirective));
            directiveInstance = element.injector.get(NodeRestoreDirective);

            alfrescoService = TestBed.get(AlfrescoApiService);
            nodesService = alfrescoService.getInstance().nodes;
            coreApi = alfrescoService.getInstance().core;
            translation = TestBed.get(TranslationService);
            notification = TestBed.get(NotificationService);
            router = TestBed.get(Router);
        });
    }));

    beforeEach(() => {
        spyOn(translation, 'get').and.returnValue(Observable.of('message'));
    });

    it('should not restore when selection is empty', () => {
        spyOn(nodesService, 'restoreNode');

        component.selection = [];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(nodesService.restoreNode).not.toHaveBeenCalled();
    });

    it('should not restore nodes when selection has nodes without path', () => {
        spyOn(nodesService, 'restoreNode');

        component.selection = [ { entry: { id: '1' } } ];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);

        expect(nodesService.restoreNode).not.toHaveBeenCalled();
    });

    it('should call restore when selection has nodes with path', fakeAsync(() => {
        spyOn(directiveInstance, 'restoreNotification').and.callFake(() => null);
        spyOn(nodesService, 'restoreNode').and.returnValue(Promise.resolve());
        spyOn(coreApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve({
            list: { entries: [] }
        }));

        component.selection = [{ entry: { id: '1', path: ['somewhere-over-the-rainbow'] } }];

        fixture.detectChanges();
        element.triggerEventHandler('click', null);
        tick();

        expect(nodesService.restoreNode).toHaveBeenCalled();
    }));

    describe('refresh()', () => {
        it('should reset selection', fakeAsync(() => {
            spyOn(directiveInstance, 'restoreNotification').and.callFake(() => null);
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.resolve());
            spyOn(coreApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve({
                list: { entries: [] }
            }));

            component.selection = [{ entry: { id: '1', path: ['somewhere-over-the-rainbow'] } }];

            fixture.detectChanges();

            expect(directiveInstance.selection.length).toBe(1);

            element.triggerEventHandler('click', null);
            tick();

            expect(directiveInstance.selection.length).toBe(0);
        }));

        it('should reset status', fakeAsync(() => {
            directiveInstance.restoreProcessStatus.fail = [{}];
            directiveInstance.restoreProcessStatus.success = [{}];

            directiveInstance.restoreProcessStatus.reset();

            expect(directiveInstance.restoreProcessStatus.fail).toEqual([]);
            expect(directiveInstance.restoreProcessStatus.success).toEqual([]);
        }));

        it('should emit event on finish', fakeAsync(() => {
            spyOn(directiveInstance, 'restoreNotification').and.callFake(() => null);
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.resolve());
            spyOn(coreApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve({
                list: { entries: [] }
            }));
            spyOn(element.nativeElement, 'dispatchEvent');

            component.selection = [{ entry: { id: '1', path: ['somewhere-over-the-rainbow'] } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(component.done).toHaveBeenCalled();
        }));
    });

    describe('notification', () => {
        beforeEach(() => {
            spyOn(coreApi.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve({
                list: { entries: [] }
            }));
        });

        it('should notify on multiple fails', fakeAsync(() => {
            const error = { message: '{ "error": {} }' };

            spyOn(notification, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });

            spyOn(nodesService, 'restoreNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.resolve();
                }

                if (id === '2') {
                    return Promise.reject(error);
                }

                if (id === '3') {
                    return Promise.reject(error);
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } },
                { entry: { id: '2', name: 'name2', path: ['somewhere-over-the-rainbow'] } },
                { entry: { id: '3', name: 'name3', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'CORE.RESTORE_NODE.PARTIAL_PLURAL',
                { number: 2 }
            );
        }));

        it('should notify fail when restored node exist, error 409', fakeAsync(() => {
            const error = { message: '{ "error": { "statusCode": 409 } }' };

            spyOn(notification, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.reject(error));

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'CORE.RESTORE_NODE.NODE_EXISTS',
                { name: 'name1' }
            );
        }));

        it('should notify fail when restored node returns different statusCode', fakeAsync(() => {
            const error = { message: '{ "error": { "statusCode": 404 } }' };

            spyOn(notification, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.reject(error));

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'CORE.RESTORE_NODE.GENERIC',
                { name: 'name1' }
            );
        }));

        it('should notify fail when restored node location is missing', fakeAsync(() => {
            const error = { message: '{ "error": { } }' };

            spyOn(notification, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.reject(error));

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'CORE.RESTORE_NODE.LOCATION_MISSING',
                { name: 'name1' }
            );
        }));

        it('should notify success when restore multiple nodes', fakeAsync(() => {
            spyOn(notification, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });
            spyOn(nodesService, 'restoreNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.resolve();
                }

                if (id === '2') {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } },
                { entry: { id: '2', name: 'name2', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'CORE.RESTORE_NODE.PLURAL'
            );
        }));

        it('should notify success on restore selected node', fakeAsync(() => {
            spyOn(notification, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.throw(null) });
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1', path: ['somewhere-over-the-rainbow'] } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(translation.get).toHaveBeenCalledWith(
                'CORE.RESTORE_NODE.SINGULAR',
                { name: 'name1' }
            );
        }));

        it('should navigate to restored node location onAction', fakeAsync(() => {
            spyOn(router, 'navigate');
            spyOn(nodesService, 'restoreNode').and.returnValue(Promise.resolve());
            spyOn(notification, 'openSnackMessageAction').and.returnValue({ onAction: () => Observable.of({}) });

            component.selection = [
                {
                    entry: {
                         id: '1',
                         name: 'name1',
                         path: {
                             elements: ['somewhere-over-the-rainbow']
                         }
                    }
                }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(router.navigate).toHaveBeenCalled();
        }));
    });
});
