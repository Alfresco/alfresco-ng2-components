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

import { AspectEntry, AspectPaging } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService, AppConfigService, LogService, setupTestBed } from 'core';
import { of, Subject, throwError } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { AspectListService } from './aspect-list.service';

const aspectListMock: AspectEntry[] = [{
    entry: {
        parentId: 'frs:aspectZero',
        id: 'frs:AspectOne',
        description: 'First Aspect with random description',
        title: 'FirstAspect',
        properties: [
            {
                id: 'channelPassword',
                title: 'The authenticated channel password',
                dataType: 'd:propA'
            },
            {
                id: 'channelUsername',
                title: 'The authenticated channel username',
                dataType: 'd:propB'
            }
        ]
    }
},
{
    entry: {
        parentId: 'frs:AspectZer',
        id: 'frs:SecondAspect',
        description: 'Second Aspect description',
        title: 'SecondAspect',
        properties: [
            {
                id: 'assetId',
                title: 'Published Asset Id',
                dataType: 'd:text'
            },
            {
                id: 'assetUrl',
                title: 'Published Asset URL',
                dataType: 'd:text'
            }
        ]
    }
}];

const customAspectListMock: AspectEntry[] = [{
    entry: {
        parentId: 'frs:aspectZero',
        id: 'frs:AspectCustom',
        description: 'First Aspect with random description',
        title: 'FirstAspect',
        properties: [
            {
                id: 'channelPassword',
                title: 'The authenticated channel password',
                dataType: 'd:propA'
            },
            {
                id: 'channelUsername',
                title: 'The authenticated channel username',
                dataType: 'd:propB'
            }
        ]
    }
}];

const listAspectResp: AspectPaging = {
    list : {
        entries: aspectListMock
    }
};

const customListAspectResp: AspectPaging = {
    list : {
        entries: customAspectListMock
    }
};

describe('AspectListService', () => {

    describe('should open the dialog', () => {
        let service: AspectListService;
        let materialDialog: MatDialog;
        let spyOnDialogOpen: jasmine.Spy;
        let spyOnDialogClose: jasmine.Spy;
        const afterOpenObservable: Subject<any> = new Subject();

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule,
                MatDialogModule
            ]
        });

        beforeEach(() => {
            service = TestBed.inject(AspectListService);
            materialDialog = TestBed.inject(MatDialog);
            spyOnDialogOpen = spyOn(materialDialog, 'open').and.returnValue({
                afterOpen: () => afterOpenObservable,
                afterClosed: () => of({}),
                componentInstance: {
                    error: new Subject<any>()
                }
            } as any);
            spyOnDialogClose = spyOn(materialDialog, 'closeAll');
        });

        it('should open the aspect list dialog', () => {
            service.openAspectListDialog();
            expect(spyOnDialogOpen).toHaveBeenCalled();
        });

        it('should close the dialog', () => {
            service.close();
            expect(spyOnDialogClose).toHaveBeenCalled();
        });
    });

    describe('should fetch the list of the aspects', () => {

        let service: AspectListService;
        let appConfigService: AppConfigService;
        let apiService: AlfrescoApiService;
        let logService: LogService;
        let aspectTypesApi: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ContentTestingModule]
            });

            aspectTypesApi = jasmine.createSpyObj('AspectsApi', ['listAspects']);
            appConfigService = TestBed.inject(AppConfigService);
            apiService = TestBed.inject(AlfrescoApiService);
            logService = TestBed.inject(LogService);

            spyOn(appConfigService, 'get').and.returnValue({ 'default': ['frs:AspectOne'] });
            spyOnProperty(apiService, 'aspectsApi').and.returnValue(aspectTypesApi);

            service = TestBed.inject(AspectListService);
        });

        it('should get the list of only available aspects', (done) => {
            aspectTypesApi.listAspects.and.returnValues(of(listAspectResp), of(customListAspectResp));
            service.getAspects().subscribe((list) => {
                expect(list.length).toBe(2);
                expect(list[0].entry.id).toBe('frs:AspectOne');
                expect(list[1].entry.id).toBe('frs:AspectCustom');
                done();
            });
        });

        it('should return a value when the standard aspect call fails', (done) => {
            spyOn(logService, 'error').and.stub();
            aspectTypesApi.listAspects.and.returnValues(throwError('Insert Coin'), of(customListAspectResp));
            service.getAspects().subscribe((list) => {
                expect(list.length).toBe(1);
                expect(list[0].entry.id).toBe('frs:AspectCustom');
                expect(logService.error).toHaveBeenCalled();
                done();
            });
        });

        it('should return a value when the custom aspect call fails', (done) => {
            spyOn(logService, 'error').and.stub();
            aspectTypesApi.listAspects.and.returnValues(of(listAspectResp), throwError('Insert Coin'));
            service.getAspects().subscribe((list) => {
                expect(list.length).toBe(1);
                expect(list[0].entry.id).toBe('frs:AspectOne');
                expect(logService.error).toHaveBeenCalled();
                done();
            });
        });
    });

});
