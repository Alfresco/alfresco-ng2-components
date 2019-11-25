/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed, fakeAsync, async, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of, empty } from 'rxjs';
import {
    setupTestBed,
    SharedLinksApiService,
    NodesApiService,
    NotificationService,
    RenditionsService,
    AppConfigService,
    CoreModule,
    AppConfigServiceMock
} from '@alfresco/adf-core';
import { ContentNodeShareModule } from './content-node-share.module';
import { ShareDialogComponent } from './content-node-share.dialog';
import moment from 'moment-es6';

describe('ShareDialogComponent', () => {
    let node;
    let matDialog: MatDialog;
    const notificationServiceMock = {
        openSnackMessage: jasmine.createSpy('openSnackMessage')
    };
    let sharedLinksApiService: SharedLinksApiService;
    let renditionService: RenditionsService;
    let nodesApiService: NodesApiService;
    let fixture: ComponentFixture<ShareDialogComponent>;
    let component: ShareDialogComponent;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot(),
            ContentNodeShareModule
        ],
        providers: [
            { provide: AppConfigService, useClass: AppConfigServiceMock },
            { provide: NotificationService, useValue: notificationServiceMock },
            { provide: MatDialogRef, useValue: { close: () => {}} },
            { provide: MAT_DIALOG_DATA, useValue: {} }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShareDialogComponent);
        matDialog = TestBed.get(MatDialog);
        sharedLinksApiService = TestBed.get(SharedLinksApiService);
        renditionService = TestBed.get(RenditionsService);
        nodesApiService = TestBed.get(NodesApiService);
        appConfigService = TestBed.get(AppConfigService);
        component = fixture.componentInstance;

        node = {
            entry: {
                id: 'nodeId',
                allowableOperations: ['update'],
                isFile: true,
                properties: {}
            }
        };
    });

    describe('Error Handling', () => {
        it('should emit a generic error when unshare fails', (done) => {
            spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(
                of(new Error(`{ "error": { "statusCode": 999 } }`))
            );

            const sub = sharedLinksApiService.error.subscribe((err) => {
                expect(err.statusCode).toBe(999);
                expect(err.message).toBe('SHARE.UNSHARE_ERROR');
                sub.unsubscribe();
                done();
            });

            component.deleteSharedLink('guid');
        });

        it('should emit permission error when unshare fails', (done) => {
            spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(
                of(new Error(`{ "error": { "statusCode": 403 } }`))
            );

            const sub = sharedLinksApiService.error.subscribe((err) => {
                expect(err.statusCode).toBe(403);
                expect(err.message).toBe('SHARE.UNSHARE_PERMISSION_ERROR');
                sub.unsubscribe();
                done();
            });

            component.deleteSharedLink('guid');
        });
    });

    it(`should toggle share action when property 'sharedId' does not exists`, () => {
        spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(of({
            entry: { id: 'sharedId', sharedId: 'sharedId' }
        }));
        spyOn(renditionService, 'generateRenditionForNode').and.returnValue(empty());

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        expect(sharedLinksApiService.createSharedLinks).toHaveBeenCalled();
        expect(renditionService.generateRenditionForNode).toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('input[formcontrolname="sharedUrl"]').value).toBe('some-url/sharedId');
        expect(fixture.nativeElement.querySelector('.mat-slide-toggle').classList).toContain('mat-checked');
    });

    it(`should not toggle share action when file has 'sharedId' property`, async(() => {
        spyOn(sharedLinksApiService, 'createSharedLinks');
        spyOn(renditionService, 'generateRenditionForNode').and.returnValue(empty());

        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();

            expect(sharedLinksApiService.createSharedLinks).not.toHaveBeenCalled();
            expect(fixture.nativeElement.querySelector('input[formcontrolname="sharedUrl"]').value).toBe('some-url/sharedId');
            expect(fixture.nativeElement.querySelector('.mat-slide-toggle').classList).toContain('mat-checked');

        });
    }));

    it('should open a confirmation dialog when unshare button is triggered', () => {
        spyOn(matDialog, 'open').and.returnValue({ beforeClose: () => of(false) });
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.callThrough();
        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        fixture.nativeElement.querySelector('.mat-slide-toggle label')
            .dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();

        expect(matDialog.open).toHaveBeenCalled();
    });

    it('should unshare file when confirmation dialog returns true', fakeAsync(() => {
        spyOn(matDialog, 'open').and.returnValue({ beforeClose: () => of(true) });
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.callThrough();
        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        fixture.nativeElement.querySelector('.mat-slide-toggle label')
            .dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();

        expect(sharedLinksApiService.deleteSharedLink).toHaveBeenCalled();
    }));

    it('should not unshare file when confirmation dialog returns false', fakeAsync(() => {
        spyOn(matDialog, 'open').and.returnValue({ beforeClose: () => of(false) });
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.callThrough();
        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        fixture.nativeElement.querySelector('.mat-slide-toggle label')
            .dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();

        expect(sharedLinksApiService.deleteSharedLink).not.toHaveBeenCalled();
    }));

    it('should not allow unshare when node has no update permission', () => {
        node.entry.properties['qshare:sharedId'] = 'sharedId';
        node.entry.allowableOperations = [];

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('.mat-slide-toggle').classList).toContain('mat-disabled');
        expect(fixture.nativeElement.querySelector('input[formcontrolname="time"]').disabled).toBe(true);
        expect(fixture.nativeElement.querySelector('mat-datetimepicker-toggle button').disabled).toBe(true);
    });

    it('should reset expiration date when toggle is unchecked', () => {
        spyOn(nodesApiService, 'updateNode').and.returnValue(of({}));
        node.entry.properties['qshare:sharedId'] = 'sharedId';
        node.entry.properties['qshare:sharedId'] = '2017-04-15T18:31:37+00:00';
        node.entry.allowableOperations = ['update'];
        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        component.form.controls['time'].setValue(moment());

        fixture.detectChanges();

        fixture.nativeElement
        .querySelector(
            '.mat-slide-toggle[data-automation-id="adf-expire-toggle"] label'
        )
        .dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();

        expect(nodesApiService.updateNode).toHaveBeenCalledWith('nodeId', {
            properties: { 'qshare:expiryDate': null }
        });

        expect(
            fixture.nativeElement.querySelector('input[formcontrolname="time"]').value
        ).toBe('');
    });

    it('should not allow expiration date action when node has no update permission', () => {
        node.entry.properties['qshare:sharedId'] = 'sharedId';
        node.entry.allowableOperations = [];

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('input[formcontrolname="time"]').disabled).toBe(true);
        expect(fixture.nativeElement.querySelector('.mat-slide-toggle[data-automation-id="adf-expire-toggle"]')
            .classList).toContain('mat-disabled');
    });

    it('should update node expiration date with selected date', () => {
        const date = moment();
        node.entry.allowableOperations = ['update'];
        node.entry.properties['qshare:sharedId'] = 'sharedId';
        spyOn(nodesApiService, 'updateNode').and.returnValue(of({}));
        fixture.componentInstance.form.controls['time'].setValue(null);

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        fixture.nativeElement
        .querySelector(
            'mat-slide-toggle[data-automation-id="adf-expire-toggle"] label'
        )
        .dispatchEvent(new MouseEvent('click'));

        fixture.componentInstance.form.controls['time'].setValue(date);
        fixture.detectChanges();

        expect(nodesApiService.updateNode).toHaveBeenCalledWith('nodeId', {
            properties: { 'qshare:expiryDate': date.utc().format() }
        });
    });

    describe('datetimepicker type', () => {
        beforeEach(() => {
            spyOn(nodesApiService, 'updateNode').and.returnValue(of({}));
            spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(of({}));
            node.entry.allowableOperations = ['update'];
            component.data = {
                node,
                baseShareUrl: 'some-url/'
            };
        });

        it('it should update node with input date and end of day time when type is `date`', () => {
            const dateTimePickerType = 'date';
            const date = moment('2525-01-01 13:00:00');
            spyOn(appConfigService, 'get').and.callFake(() => dateTimePickerType);

            fixture.detectChanges();
            fixture.nativeElement.querySelector('mat-slide-toggle[data-automation-id="adf-expire-toggle"] label')
                .dispatchEvent(new MouseEvent('click'));

            fixture.componentInstance.form.controls['time'].setValue(date);
            fixture.detectChanges();

            expect(nodesApiService.updateNode).toHaveBeenCalledWith('nodeId', {
                    properties: { 'qshare:expiryDate': date.endOf('day').utc().format() }
            });
        });

        it('it should update node with input date and time when type is `datetime`', () => {
            const dateTimePickerType = 'datetime';
            const date = moment('2525-01-01 13:00:00');
            spyOn(appConfigService, 'get').and.callFake(() => dateTimePickerType);

            fixture.detectChanges();
            fixture.nativeElement.querySelector('mat-slide-toggle[data-automation-id="adf-expire-toggle"] label')
                .dispatchEvent(new MouseEvent('click'));

            fixture.componentInstance.form.controls['time'].setValue(date);
            fixture.detectChanges();

            expect(nodesApiService.updateNode).toHaveBeenCalledWith('nodeId', {
                    properties: { 'qshare:expiryDate': date.utc().format() }
            });
        });
    });
});
