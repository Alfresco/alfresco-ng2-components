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

import moment from 'moment';

import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { setupTestBed } from '@alfresco/adf-core';
import { NodeLockDialogComponent } from './node-lock.dialog';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('NodeLockDialogComponent', () => {

    let fixture: ComponentFixture<NodeLockDialogComponent>;
    let component: NodeLockDialogComponent;
    let expiryDate;
    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NodeLockDialogComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Node lock dialog component', () => {

        beforeEach(() => {
            jasmine.clock().mockDate(new Date());
            expiryDate = moment().add(1, 'minutes');

            component.data = {
                node: {
                    id: 'node-id',
                    name: 'node-name',
                    isLocked: true,
                    properties: {
                        ['cm:lockType']: 'WRITE_LOCK',
                        ['cm:expiryDate']: expiryDate
                    }
                },
                onError: () => {
                }
            };
            fixture.detectChanges();
        });

        it('should init dialog with form inputs', () => {
            expect(component.nodeName).toBe('node-name');
            expect(component.form.value.isLocked).toBe(true);
            expect(component.form.value.allowOwner).toBe(true);
            expect(component.form.value.isTimeLock).toBe(true);
            expect(component.form.value.time.format()).toBe(expiryDate.format());
        });

        it('should update form inputs', () => {
            const newTime = moment();
            component.form.controls['isLocked'].setValue(false);
            component.form.controls['allowOwner'].setValue(false);
            component.form.controls['isTimeLock'].setValue(false);
            component.form.controls['time'].setValue(newTime);

            expect(component.form.value.isLocked).toBe(false);
            expect(component.form.value.allowOwner).toBe(false);
            expect(component.form.value.isTimeLock).toBe(false);
            expect(component.form.value.time.format()).toBe(newTime.format());
        });

        it('should call dialog to close with form data when submit is successfully', fakeAsync(() => {
            const node: any = { entry: {} };
            spyOn(component['nodesApi'], 'lockNode').and.returnValue(Promise.resolve(node));

            component.submit();
            tick();
            fixture.detectChanges();

            expect(dialogRef.close).toHaveBeenCalledWith(node.entry);
        }));

        it('should call onError if submit fails', fakeAsync(() => {
            spyOn(component['nodesApi'], 'lockNode').and.returnValue(Promise.reject('error'));
            spyOn(component.data, 'onError');

            component.submit();
            tick();
            fixture.detectChanges();

            expect(component.data.onError).toHaveBeenCalled();
        }));
    });
});
