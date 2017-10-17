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
import { Observable } from 'rxjs/Rx';
import { AlfrescoTranslationService } from '../../index';
import { CoreModule } from '../../index';
import { AlfrescoApiService } from '../services/alfresco-api.service';
import { NotificationService } from '../services/notification.service';
import { NodeDeleteDirective } from './node-delete.directive';

@Component({
    template: `
        <div [adf-delete]="selection"
             (delete)="done()">
        </div>`
})
class TestComponent {
    selection = [];

    done = jasmine.createSpy('done');
}

describe('NodeDeleteDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let component: TestComponent;
    let alfrescoApi: AlfrescoApiService;
    let translation: AlfrescoTranslationService;
    let notification: NotificationService;
    let nodeApi;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                TestComponent
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(TestComponent);
            component = fixture.componentInstance;
            element = fixture.debugElement.query(By.directive(NodeDeleteDirective));

            alfrescoApi = TestBed.get(AlfrescoApiService);
            nodeApi = alfrescoApi.getInstance().nodes;
            translation = TestBed.get(AlfrescoTranslationService);
            notification = TestBed.get(NotificationService);
        });
    }));

    beforeEach(() => {
        spyOn(translation, 'get').and.callFake((key) => {
            return Observable.of(key);
        });
    });

    describe('Delete', () => {
        beforeEach(() => {
            spyOn(notification, 'openSnackMessageAction')
                .and.returnValue({ onAction: () => Observable.throw(null) });
        });

        it('should do nothing if selection is empty', () => {
            spyOn(nodeApi, 'deleteNode');
            component.selection = [];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);

            expect(nodeApi.deleteNode).not.toHaveBeenCalled();
        });

        it('should process node successfully', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

            component.selection = <any> [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessageAction).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.SINGULAR', 'Undo'
            );
        }));

        it('should notify failed node deletion', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.reject('error'));

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessageAction).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.ERROR_SINGULAR', ''
            );
        }));

        it('should notify nodes deletion', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessageAction).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.PLURAL', 'Undo'
            );
        }));

        it('should notify failed nodes deletion', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.reject('error'));

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessageAction).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.ERROR_PLURAL', ''
            );
        }));

        it('should notify partial deletion when only one node is successful', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject('error');
                } else {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessageAction).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.PARTIAL_SINGULAR', 'Undo'
            );
        }));

        it('should notify partial deletion when some nodes are successful', fakeAsync(() => {
            spyOn(nodeApi, 'deleteNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject(null);
                }

                if (id === '2') {
                    return Promise.resolve();
                }

                if (id === '3') {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notification.openSnackMessageAction).toHaveBeenCalledWith(
                'CORE.DELETE_NODE.PARTIAL_PLURAL', 'Undo'
            );
        }));

        it('should emit event when delete is done', fakeAsync(() => {
            component.done.calls.reset();
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

            component.selection = <any> [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(component.done).toHaveBeenCalled();
        }));
    });

    describe('Restore', () => {
        let notificationSpy;

        beforeEach(() => {
            spyOn(nodeApi, 'deleteNode').and.returnValue(Promise.resolve());

            notificationSpy = spyOn(notification, 'openSnackMessageAction')
                .and.callFake(() => {
                    if (notificationSpy.calls.count() === 1) {
                        return { onAction: () => Observable.of({}) };
                    } else {
                        return { onAction: () => Observable.throw(null) };
                    }
                });
        });

        it('should notify node restore', fakeAsync(() => {
            spyOn(nodeApi, 'restoreNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationSpy.calls.mostRecent().args[0]).toEqual('CORE.DELETE_NODE.RESTORE_SINGULAR');
        }));

        it('should notify nodes restore', fakeAsync(() => {
            spyOn(nodeApi, 'restoreNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationSpy.calls.mostRecent().args[0]).toEqual('CORE.DELETE_NODE.RESTORE_PLURAL');
        }));

        it('should notify failed node restore', fakeAsync(() => {
            spyOn(nodeApi, 'restoreNode').and.returnValue(Promise.reject('error'));

            component.selection = [{ entry: { id: '1', name: 'name1' } }];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationSpy.calls.mostRecent().args[0]).toEqual('CORE.DELETE_NODE.RESTORE_ERROR_SINGULAR');
        }));

        it('should notify failed nodes restore', fakeAsync(() => {
            spyOn(nodeApi, 'restoreNode').and.returnValue(Promise.reject('error'));

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationSpy.calls.mostRecent().args[0]).toEqual('CORE.DELETE_NODE.RESTORE_ERROR_PLURAL');
        }));

        it('should notify partial restore when only one node is successful', fakeAsync(() => {
            spyOn(nodeApi, 'restoreNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject('error');
                } else {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationSpy.calls.mostRecent().args[0]).toEqual('CORE.DELETE_NODE.RESTORE_PARTIAL_SINGULAR');
        }));

        it('should notify partial restore when some nodes are successful', fakeAsync(() => {
            spyOn(nodeApi, 'restoreNode').and.callFake((id) => {
                if (id === '1') {
                    return Promise.reject(null);
                }

                if (id === '2') {
                    return Promise.resolve();
                }

                if (id === '3') {
                    return Promise.resolve();
                }
            });

            component.selection = [
                { entry: { id: '1', name: 'name1' } },
                { entry: { id: '2', name: 'name2' } },
                { entry: { id: '3', name: 'name3' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(notificationSpy.calls.mostRecent().args[0]).toEqual('CORE.DELETE_NODE.RESTORE_PARTIAL_PLURAL');
        }));

        it('should emit event when restore is done', fakeAsync(() => {
            spyOn(nodeApi, 'restoreNode').and.returnValue(Promise.resolve());

            component.selection = [
                { entry: { id: '1', name: 'name1' } }
            ];

            fixture.detectChanges();
            element.triggerEventHandler('click', null);
            tick();

            expect(component.done).toHaveBeenCalled();
            expect(component.done.calls.count()).toBe(2);
        }));
    });
});
