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
import { TestBed, fakeAsync, async } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { of, empty } from 'rxjs';
import {
    setupTestBed,
    CoreModule,
    SharedLinksApiService,
    NodesApiService,
    NotificationService,
    RenditionsService
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
    let fixture;
    let component;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot(),
            ContentNodeShareModule
        ],
        providers: [
            NodesApiService,
            SharedLinksApiService,
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
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        node = {
            entry: {
                id: 'nodeId',
                allowableOperations: ['update'],
                isFile: true,
                properties: {}
            }
        };
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

    it('should not update shared node expiryDate property when value changes', () => {
        const date = moment();

        node.entry.properties['qshare:sharedId'] = 'sharedId';
        spyOn(nodesApiService, 'updateNode');
        fixture.componentInstance.form.controls['time'].setValue(null);
        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();
        fixture.componentInstance.form.controls['time'].setValue(date);
        fixture.detectChanges();

        expect(nodesApiService.updateNode).toHaveBeenCalled();
    });
});
