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

import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService, CardViewSelectItemOption, setupTestBed } from 'core';
import { of, Subject } from 'rxjs';
import { MimeTypeService } from '../../mime-type/mime-type.service';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { MimeTypeProperty } from '../models/mime-type-property.model';
import { MimeTypePropertiesService } from './mime-type-properties.service';

describe('MimrTypePropertiesService', () => {

    let mimeTypePropertiesService: MimeTypePropertiesService;

    describe('Card View Item Options', () => {

        const mimeTypeService = new MimeTypeService(new AppConfigService(null));
        const fakeMimeTypeProperty: MimeTypeProperty = { 'mimetype': 'banana', 'display': 'Bananas in Pajamas' };
        const dialog: MatDialog = jasmine.createSpyObj(['open']);

        beforeEach(() => {
            spyOn(mimeTypeService, 'getMimeTypeOptions').and.returnValue(of([fakeMimeTypeProperty]));
            mimeTypePropertiesService = new MimeTypePropertiesService(mimeTypeService, dialog);
        });

        it('should return the list of properties as compatible card items options', (done) => {
            mimeTypePropertiesService.getMimeTypeCardOptions().subscribe((result: CardViewSelectItemOption<string>[]) => {
                expect(result.length).toBe(1);
                expect(result[0].key).toBe('banana');
                expect(result[0].label).toBe('Bananas in Pajamas');
                done();
            });
        });
    });

    describe('Confirm Dialog', () => {
        let materialDialog: MatDialog;
        let spyOnDialogOpen: jasmine.Spy;
        let afterOpenObservable: Subject<any>;

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });

        beforeEach(() => {
            mimeTypePropertiesService = TestBed.inject(MimeTypePropertiesService);
            materialDialog = TestBed.inject(MatDialog);
            afterOpenObservable = new Subject<any>();
            spyOnDialogOpen = spyOn(materialDialog, 'open').and.returnValue({
                afterOpen: () => afterOpenObservable,
                afterClosed: () => of({}),
                componentInstance: {
                    error: new Subject<any>()
                }
            });
        });

        it('should open the confirm mime type change dialog', () => {
            mimeTypePropertiesService.openMimeTypeDialogConfirm();
            expect(spyOnDialogOpen).toHaveBeenCalled();
        });

        it('should close the dialog', () => {
            spyOn(materialDialog, 'closeAll');
            mimeTypePropertiesService.close();
            expect(materialDialog.closeAll).toHaveBeenCalled();
        });

    });

});
