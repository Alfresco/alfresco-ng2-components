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

import { async, TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ShareDialogComponent } from './share.dialog';
import { ContentTestingModule } from '../testing/content.testing.module';
import { SharedLinksApiService, setupTestBed } from '@alfresco/adf-core';

describe('ShareDialogComponent', () => {

    let fixture: ComponentFixture<ShareDialogComponent>;
    let spyCreate: any;
    let component: ShareDialogComponent;
    let sharedLinksApiService: SharedLinksApiService;
    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    let data: any = {
        node: { entry: { properties: { 'qshare:sharedId': 'example-link' }, name: 'example-name' } },
        baseShareUrl: 'baseShareUrl-example'
    };

    setupTestBed({
        imports: [ContentTestingModule],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef },
            { provide: MAT_DIALOG_DATA, useValue: data }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShareDialogComponent);
        sharedLinksApiService = TestBed.get(SharedLinksApiService);
        component = fixture.componentInstance;

        fixture.detectChanges();

        spyCreate = spyOn(sharedLinksApiService, 'createSharedLinks').and.returnValue(Observable.of({ entry: { id: 'test-sharedId' } }));
    });

    it('should init the dialog with the file name and baseShareUrl', async(() => {
        component.data = {
            baseShareUrl: 'base-url/',
            node: { entry: { properties: { 'qshare:sharedId': 'example-link' }, name: 'example-name' } }
        };

        component.ngOnInit();

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelector('#adf-share-link').value).toBe('base-url/example-link');
        });
    }));

    describe('public link creation', () => {

        it('should not create the public link if it already present in the node', () => {
            component.data = {
                node: { entry: { properties: { 'qshare:sharedId': 'example-link' }, name: 'example-name' } }
            };

            component.ngOnInit();

            expect(spyCreate).not.toHaveBeenCalled();
        });

        it('should create the public link if is not present in the node', () => {
            component.data = {
                node: { entry: { properties: {}, name: 'example-name' } },
                baseShareUrl: 'baseShareUrl-example'
            };

            component.ngOnInit();

            expect(spyCreate).toHaveBeenCalled();
        });

        it('should update the data structure after created the link', async(() => {
            component.data = {
                node: { entry: { name: 'example-name', properties: {} } },
                baseShareUrl: 'baseShareUrl-example'
            };
            component.ngOnInit();

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(component.data.node.entry.properties['qshare:sharedId']).toBe('test-sharedId');
            });
        }));
    });

});
