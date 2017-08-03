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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { ActivitiAlfrescoContentService } from '../../../services/activiti-alfresco.service';
import { ExternalContent } from '../core/external-content';
import { ExternalContentLink } from '../core/external-content-link';
import { FormFieldTypes } from '../core/form-field-types';
import { EcmModelService } from './../../../services/ecm-model.service';
import { FormService } from './../../../services/form.service';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { AttachWidgetComponent } from './attach.widget';

describe('AttachWidgetComponent', () => {

    let widget: AttachWidgetComponent;
    let fixture: ComponentFixture<AttachWidgetComponent>;
    let element: HTMLElement;
    let contentService: ActivitiAlfrescoContentService;
    let dialogPolyfill: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                AttachWidgetComponent
            ],
            providers: [
                FormService,
                EcmModelService,
                ActivitiAlfrescoContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttachWidgetComponent);
        contentService = TestBed.get(ActivitiAlfrescoContentService);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;

        dialogPolyfill = {
            registerDialog(obj: any) {
                obj.showModal = () => {
                };
            }
        };

        window['dialogPolyfill'] = dialogPolyfill;
    });

    it('should require field value to check file', () => {
        widget.field = null;
        widget.ngOnInit();
        expect(widget.hasFile()).toBeFalsy();

        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            value: null
        });
        widget.ngOnInit();
        expect(widget.hasFile()).toBeFalsy();

        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            value: [{name: 'file'}]
        });
        widget.ngOnInit();
        expect(widget.hasFile()).toBeTruthy();
    });

    it('should setup with form field', () => {
        let nodes = [{}];
        spyOn(contentService, 'getAlfrescoNodes').and.returnValue(
            Observable.create(observer => {
                observer.next(nodes);
                observer.complete();
            })
        );

        let config = {
            siteId: '<id>',
            site: '<site>',
            pathId: '<pathId>',
            accountId: '<accountId>'
        };

        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            params: {
                fileSource: {
                    selectedFolder: config
                }
            }
        });
        widget.ngOnInit();

        expect(widget.selectedFolderSiteId).toBe(config.siteId);
        expect(widget.selectedFolderSiteName).toBe(config.site);
        expect(widget.selectedFolderPathId).toBe(config.pathId);
        expect(widget.selectedFolderAccountId).toBe(config.accountId);
        expect(widget.selectedFolderNodes).toEqual(nodes);
    });

    xit('should link file on select', () => {
        let link = <ExternalContentLink> {};
        spyOn(contentService, 'linkAlfrescoNode').and.returnValue(
            Observable.create(observer => {
                observer.next(link);
                observer.complete();
            })
        );

        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD
        });
        widget.ngOnInit();

        let node = <ExternalContent> {};
        widget.selectFile(node, null);

        expect(contentService.linkAlfrescoNode).toHaveBeenCalled();
        expect(widget.selectedFile).toBe(node);
        expect(widget.field.value).toEqual([link]);
        expect(widget.field.json.value).toEqual([link]);
        expect(widget.hasFile()).toBeTruthy();
    });

    it('should reset', () => {
        widget.field = new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.UPLOAD,
            value: [{name: 'filename'}]
        });

        widget.reset();
        expect(widget.hasFile()).toBeFalsy();
        expect(widget.field.value).toBeNull();
        expect(widget.field.json.value).toBeNull();
        expect(widget.hasFile()).toBeFalsy();
    });

    it('should close dialog on cancel', () => {
        let closed = false;
        widget.dialog = {
            nativeElement: {
                close: function () {
                    closed = true;
                }
            }
        };
        widget.cancel();
        expect(closed).toBeTruthy();
    });

    it('should show modal dialog', () => {
        spyOn(contentService, 'getAlfrescoNodes').and.returnValue(
            Observable.create(observer => {
                observer.next([]);
                observer.complete();
            })
        );

        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            params: {
                fileSource: {
                    selectedFolder: {}
                }
            }
        });

        let modalShown = false;
        widget.dialog = {
            nativeElement: {
                showModal: function () {
                    modalShown = true;
                }
            }
        };

        widget.showDialog();
        expect(modalShown).toBeTruthy();
    });

    it('should select folder and load nodes', () => {
        let nodes = [{}];
        spyOn(contentService, 'getAlfrescoNodes').and.returnValue(
            Observable.create(observer => {
                observer.next(nodes);
                observer.complete();
            })
        );

        let node = <ExternalContent> {id: '<id>'};
        widget.selectFolder(node, null);

        expect(widget.selectedFolderPathId).toBe(node.id);
        expect(widget.selectedFolderNodes).toEqual(nodes);
    });

    it('should get linked file name via local variable', () => {
        widget.fileName = '<fileName>';
        widget.selectedFile = null;
        widget.field = null;
        expect(widget.getLinkedFileName()).toBe(widget.fileName);
    });

    it('should get linked file name via selected file', () => {
        widget.fileName = null;
        widget.selectedFile = <ExternalContent> {title: '<title>'};
        widget.field = null;
        expect(widget.getLinkedFileName()).toBe(widget.selectedFile.title);
    });

    it('should get linked file name via form field', () => {
        widget.fileName = null;
        widget.selectedFile = null;

        let name = '<file>';
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            value: [{name: name}]
        });

        expect(widget.getLinkedFileName()).toBe(name);
    });

    it('should require form field to setup file browser', () => {
        widget.field = null;
        widget.setupFileBrowser();

        expect(widget.selectedFolderPathId).toBeUndefined();
        expect(widget.selectedFolderAccountId).toBeUndefined();

        const pathId = '<pathId>';
        const accountId = '<accountId>';

        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            params: {
                fileSource: {
                    selectedFolder: {
                        pathId: pathId,
                        accountId: accountId
                    }
                }
            }
        });
        widget.setupFileBrowser();
        expect(widget.selectedFolderPathId).toBe(pathId);
        expect(widget.selectedFolderAccountId).toBe(accountId);
    });

    it('should get external content nodes', () => {
        let nodes = [{}];
        spyOn(contentService, 'getAlfrescoNodes').and.returnValue(
            Observable.create(observer => {
                observer.next(nodes);
                observer.complete();
            })
        );

        const accountId = '<accountId>';
        const pathId = '<pathId>';
        widget.selectedFolderAccountId = accountId;
        widget.selectedFolderPathId = pathId;
        widget.getExternalContentNodes();

        expect(contentService.getAlfrescoNodes).toHaveBeenCalledWith(accountId, pathId);
        expect(widget.selectedFolderNodes).toEqual(nodes);
    });

    it('should handle error', (done) => {
        let error = 'error';
        spyOn(contentService, 'getAlfrescoNodes').and.returnValue(
            Observable.throw(error)
        );

        widget.error.subscribe(() => {
            done();
        });

        widget.getExternalContentNodes();
    });

    it('should register dialog via polyfill', () => {
        widget.dialog = {
            nativeElement: {}
        };
        spyOn(dialogPolyfill, 'registerDialog').and.callThrough();
        spyOn(widget, 'setupFileBrowser').and.stub();
        spyOn(widget, 'getExternalContentNodes').and.stub();
        widget.showDialog();
        expect(dialogPolyfill.registerDialog).toHaveBeenCalledWith(widget.dialog.nativeElement);
    });

    it('should require configured dialog to show modal', () => {
        widget.dialog = null;
        spyOn(widget, 'setupFileBrowser').and.stub();
        spyOn(widget, 'getExternalContentNodes').and.stub();
        expect(widget.showDialog()).toBeFalsy();
    });
});
