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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    FormFieldModel,
    FormFieldTypes,
    FormModel,
    FormService
    // setupTestBed
    // FormFieldModel,
    // FormModel,
    // FormFieldTypes
} from '@alfresco/adf-core';

import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentModule } from '@alfresco/adf-content-services';
import { FormCloudModule } from '../../../form-cloud.module';
import { TranslateModule } from '@ngx-translate/core';
import { FilePropertiesTableCloudComponent } from './file-properties-table-cloud.component';
import { allSourceParams, fakeMinimalNode, fakeNodeWithProperties } from '../../../mocks/attach-file-cloud-widget.mock';
import { ProcessCloudContentService } from '../../../public-api';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';


fdescribe('FilePropertiesTableCloudComponent', () => {
    let widget: FilePropertiesTableCloudComponent;
    let fixture: ComponentFixture<FilePropertiesTableCloudComponent>;
    let processCloudContentService: ProcessCloudContentService;
    let formService: FormService;

    // let dataSource: CdkTableDataSourceInput<any>;


    let element: HTMLInputElement;

    const createUploadWidgetField = (form: FormModel, fieldId: string, value?: any, params?: any, multiple?: boolean, name?: string, readOnly?: boolean) => {
        widget.field = new FormFieldModel(form, {
            type: FormFieldTypes.UPLOAD,
            value,
            id: fieldId,
            readOnly,
            name,
            tooltip: 'attach file widget',
            params: { ...params, multiple }
        });
    };
    // const fakePngUpload: any = {
    //     id: 1166,
    //     name: 'fake-png.png',
    //     created: '2017-07-25T17:17:37.099Z',
    //     createdBy: { id: 1001, firstName: 'Admin', lastName: 'admin', email: 'admin' },
    //     relatedContent: false,
    //     contentAvailable: true,
    //     link: false,
    //     isExternal: false,
    //     mimeType: 'image/png',
    //     simpleType: 'image',
    //     previewStatus: 'queued',
    //     thumbnailStatus: 'queued'
    // };
    // const clickOnAttachFileWidget = (id: string) => {
    //     const attachButton: HTMLButtonElement = element.querySelector(`#${id}`);
    //     attachButton.click();
    // };

    // setupTestBed({
    //     imports: [
    //         TranslateModule.forRoot(),
    //         ProcessServiceCloudTestingModule,
    //         FormCloudModule,
    //         ContentModule.forRoot()
    //     ],
    //     declarations: [FilePropertiesTableCloudComponent]
    //     // schemas: [CUSTOM_ELEMENTS_SCHEMA]
    // });

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ProcessServiceCloudTestingModule,
                FormCloudModule,
                ContentModule.forRoot()
            ],
            declarations: [FilePropertiesTableCloudComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FilePropertiesTableCloudComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;
        processCloudContentService = TestBed.inject(ProcessCloudContentService);
        formService = TestBed.inject(FormService);

        widget.uploadedFiles = [{id: 'id'}];
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    // it('should select row on click', () => {
    //     const row = {selected: false} as any;
    //     widget.onAttachFileClicked(row);

    //     expect(row.selected).toBeTruthy();
    //     // expect(component.field.selected).toBe(row);
    // });

    // it('should preview file when file is clicked', (done) => {
    //     spyOn(processCloudContentService, 'getRawContentNode').and.returnValue(of(new Blob()));
    //     formService.formContentClicked.subscribe(
    //         (fileClicked: any) => {
    //             expect(fileClicked.nodeId).toBe('fake-properties');
    //             done();
    //         }
    //     );

    //     fixture.detectChanges();

    //     const menuButton = fixture.debugElement.query(By.css('#file-fake-properties')).nativeElement as HTMLButtonElement;
    //     menuButton.click();
    //     fixture.detectChanges();

    // });

    // fit('should throw a nodeClicked event when a node is clicked', (done) => {
    //     widget.attachFileClick.subscribe((nodeClicked) => {
    //         expect(nodeClicked).toBeDefined();
    //         expect(nodeClicked).not.toBeNull();
    //         expect(nodeClicked.entry.name).toBe('fake-node-name');
    //         expect(nodeClicked.entry.id).toBe('fake-node-id');
    //         done();
    //     });
    //     const button = fixture.debugElement.query(By.css('#file-fake-properties'));
    //     button.nativeElement.click();
    // });


    it('should emit attachFileClick', async () => {
        debugger;

        // createUploadWidgetField(new FormModel(), 'attach-file-alfresco', [], allSourceParams);
        // fixture.detectChanges();
        // await fixture.whenStable();
        // expect(element.querySelector('#attach-file-alfresco')).not.toBeNull();

  
    //     const attachedFileName = fixture.debugElement.query(By.css('.adf-file'));

    //     expect(attachedFileName.nativeElement.innerText).toEqual('fake-name');

        // component.onAttachFileClicked(fakeNodeWithProperties);
        // const showOption = fixture.debugElement.query(By.css('#file-fake-properties-show-file')).nativeElement as HTMLButtonElement;
        // const test = fixture.debugElement.query(By.css('#file-id'));
//         const test = fixture.nativeElement.querySelector('#file-id');

        // const showOption = fixture.debugElement.query(By.css('.adf-file'));
        // showOption.nativeElement.click();
        // expect(nodeContentLoadedSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
    });

});
