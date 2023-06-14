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

import { TestBed, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import {
    setupTestBed,
    NotificationService,
    AppConfigService
} from '@alfresco/adf-core';
import { NodesApiService } from '../common/services/nodes-api.service';
import { RenditionService } from '../common/services/rendition.service';

import { SharedLinksApiService } from './services/shared-links-api.service';
import { ShareDialogComponent } from './content-node-share.dialog';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { format, endOfDay } from 'date-fns';

describe('ShareDialogComponent', () => {
    let node;
    let matDialog: MatDialog;
    const notificationServiceMock = {
        openSnackMessage: jasmine.createSpy('openSnackMessage')
    };
    let sharedLinksApiService: SharedLinksApiService;
    let renditionService: RenditionService;
    let nodesApiService: NodesApiService;
    let fixture: ComponentFixture<ShareDialogComponent>;
    let component: ShareDialogComponent;
    let appConfigService: AppConfigService;

    const shareToggleId = '[data-automation-id="adf-share-toggle"]';

    const getShareToggleLinkedClasses = (): DOMTokenList => fixture.nativeElement.querySelector(shareToggleId).classList;

    const clickShareToggleButton = () => fixture.nativeElement.querySelector(`${shareToggleId} label`)
    .dispatchEvent(new MouseEvent('click'));

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        providers: [
            {provide: NotificationService, useValue: notificationServiceMock},
            {
                provide: MatDialogRef, useValue: {
                    close: () => {
                    }
                }
            },
            {provide: MAT_DIALOG_DATA, useValue: {}}
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShareDialogComponent);
        component = fixture.componentInstance;
        component.maxDebounceTime = 0;

        matDialog = TestBed.inject(MatDialog);
        sharedLinksApiService = TestBed.inject(SharedLinksApiService);
        renditionService = TestBed.inject(RenditionService);
        nodesApiService = TestBed.inject(NodesApiService);
        appConfigService = TestBed.inject(AppConfigService);

        node = {
            entry: {
                id: 'nodeId',
                allowableOperations: ['update'],
                isFile: true,
                properties: {}
            }
        };

        spyOn(nodesApiService, 'updateNode').and.returnValue(of(null));
    });

    afterEach(() => {
        fixture.destroy();
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
            entry: {id: 'sharedId', sharedId: 'sharedId'}
        }));
        spyOn(renditionService, 'getNodeRendition').and.returnValue(Promise.resolve({url: '', mimeType: ''}));

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        expect(sharedLinksApiService.createSharedLinks).toHaveBeenCalled();
        expect(renditionService.getNodeRendition).toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('input[formcontrolname="sharedUrl"]').value).toBe('some-url/sharedId');
        expect(getShareToggleLinkedClasses()).toContain('mat-checked');
    });

    it(`should not toggle share action when file has 'sharedId' property`, async () => {
        spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(of({
            entry: {id: 'sharedId', sharedId: 'sharedId'}
        }));
        spyOn(renditionService, 'getNodeRendition').and.returnValue(Promise.resolve({url: '', mimeType: ''}));

        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        await fixture.whenStable();
        fixture.detectChanges();

        expect(sharedLinksApiService.createSharedLinks).not.toHaveBeenCalled();
        expect(fixture.nativeElement.querySelector('input[formcontrolname="sharedUrl"]').value).toBe('some-url/sharedId');
        expect(getShareToggleLinkedClasses()).toContain('mat-checked');
    });

    it('should open a confirmation dialog when unshare button is triggered', () => {
        spyOn(matDialog, 'open').and.returnValue({beforeClosed: () => of(false)} as any);
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.callThrough();

        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        clickShareToggleButton();

        fixture.detectChanges();

        expect(matDialog.open).toHaveBeenCalled();
    });

    it('should unshare file when confirmation dialog returns true', fakeAsync(() => {
        spyOn(matDialog, 'open').and.returnValue({beforeClosed: () => of(true)} as any);
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(of({}));
        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        clickShareToggleButton();

        fixture.detectChanges();

        expect(sharedLinksApiService.deleteSharedLink).toHaveBeenCalled();
    }));

    it('should not unshare file when confirmation dialog returns false', fakeAsync(() => {
        spyOn(matDialog, 'open').and.returnValue({beforeClosed: () => of(false)} as any);
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.callThrough();
        node.entry.properties['qshare:sharedId'] = 'sharedId';

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        clickShareToggleButton();

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

        expect(getShareToggleLinkedClasses()).toContain('mat-disabled');
    });

    it('should delete the current link generated with expiry date and generate a new link without expiry date when toggle is unchecked', async () => {
        spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(of());
        spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(of({}));

        node.entry.properties['qshare:sharedId'] = 'sharedId';
        node.entry.properties['qshare:sharedId'] = '2017-04-15T18:31:37+00:00';
        node.entry.allowableOperations = ['update'];
        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();

        component.form.controls['time'].setValue(new Date());

        fixture.detectChanges();

        fixture.nativeElement
            .querySelector('.mat-slide-toggle[data-automation-id="adf-expire-toggle"] label')
            .dispatchEvent(new MouseEvent('click'));

        fixture.detectChanges();

        await fixture.whenStable();

        expect(sharedLinksApiService.deleteSharedLink).toHaveBeenCalled();
        expect(sharedLinksApiService.createSharedLinks).toHaveBeenCalledWith('nodeId', undefined);
    });

    it('should not allow expiration date action when node has no update permission', async () => {
        node.entry.properties['qshare:sharedId'] = 'sharedId';
        node.entry.allowableOperations = [];

        component.data = {
            node,
            baseShareUrl: 'some-url/'
        };

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.nativeElement.querySelector('.mat-slide-toggle[data-automation-id="adf-expire-toggle"]')
        .classList).toContain('mat-disabled');
        expect(fixture.nativeElement.querySelector('[data-automation-id="adf-slide-toggle-checked"]').style.display).toEqual('none');
    });


    describe('datetimepicker type', () => {
        beforeEach(() => {
            spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(of());
            spyOn(sharedLinksApiService, 'deleteSharedLink').and.returnValue(of({}));

            node.entry.properties['qshare:sharedId'] = 'sharedId';
            node.entry.allowableOperations = ['update'];
            component.data = {
                node,
                baseShareUrl: 'some-url/'
            };
        });

        it('should update node with input date and end of day time when type is `date`', fakeAsync(() => {
            const dateTimePickerType = 'date';
            const date = new Date('2525-01-01');
            spyOn(appConfigService, 'get').and.callFake(() => dateTimePickerType as any);

            fixture.detectChanges();
            fixture.nativeElement.querySelector('mat-slide-toggle[data-automation-id="adf-expire-toggle"] label')
                .dispatchEvent(new MouseEvent('click'));

            fixture.componentInstance.time.setValue(date);
            fixture.detectChanges();
            tick(500);

            const expiryDate = format(endOfDay(date as Date), `yyyy-MM-dd'T'HH:mm:ss.SSSxx`);

            expect(sharedLinksApiService.deleteSharedLink).toHaveBeenCalled();
            expect(sharedLinksApiService.createSharedLinks).toHaveBeenCalledWith('nodeId', {
                nodeId: 'nodeId',
                expiresAt: expiryDate
            });
        }));

        it('should update node with input date and time when type is `datetime`', fakeAsync(() => {
            const dateTimePickerType = 'datetime';
            const date = new Date('2525-01-01 13:00:00');
            spyOn(appConfigService, 'get').and.returnValue(dateTimePickerType);

            fixture.detectChanges();
            fixture.nativeElement.querySelector('mat-slide-toggle[data-automation-id="adf-expire-toggle"] label')
                .dispatchEvent(new MouseEvent('click'));

            fixture.componentInstance.type = 'datetime';
            fixture.componentInstance.time.setValue(date);
            fixture.detectChanges();
            tick(100);

            const expiryDate = format((new Date(date)), `yyyy-MM-dd'T'HH:mm:ss.SSSxx`);

            expect(sharedLinksApiService.deleteSharedLink).toHaveBeenCalled();
            expect(sharedLinksApiService.createSharedLinks).toHaveBeenCalledWith('nodeId', {
                nodeId: 'nodeId',
                expiresAt: expiryDate
            });
        }));
    });
});
