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
import { MATERIAL_MODULE } from '../../../../index';
import { ActivitiAlfrescoContentService } from '../../../services/activiti-alfresco.service';
import { fakeFormJson } from '../../../services/assets/widget-visibility.service.mock';
import { WIDGET_DIRECTIVES } from '../index';
import { MASK_DIRECTIVE } from '../index';
import { EcmModelService } from './../../../services/ecm-model.service';
import { FormService } from './../../../services/form.service';
import { FormFieldComponent } from './../../form-field/form-field.component';
import { ContentWidgetComponent } from './../content/content.widget';
import { FormFieldTypes } from './../core/form-field-types';
import { FormFieldModel } from './../core/form-field.model';
import { FormModel } from './../core/form.model';
import { ContainerWidgetComponent } from './container.widget';
import { ContainerWidgetComponentModel } from './container.widget.model';

describe('ContainerWidgetComponent', () => {

    let widget: ContainerWidgetComponent;
    let fixture: ComponentFixture<ContainerWidgetComponent>;
    let element: HTMLElement;
    let contentService: ActivitiAlfrescoContentService;
    let dialogPolyfill;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                ...MATERIAL_MODULE
            ],
            declarations: [FormFieldComponent, ContentWidgetComponent, WIDGET_DIRECTIVES, MASK_DIRECTIVE],
            providers: [
                FormService,
                EcmModelService,
                ActivitiAlfrescoContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContainerWidgetComponent);
        contentService = TestBed.get(ActivitiAlfrescoContentService);

        element = fixture.nativeElement;
        widget = fixture.componentInstance;

        dialogPolyfill = {
            registerDialog(obj: any) {
                obj.showModal = function () {
                };
            }
        };
    });

    it('should wrap field with model instance', () => {
        let field = new FormFieldModel(null);
        widget.field = field;
        widget.ngOnInit();
        expect(widget.content).toBeDefined();
        expect(widget.content.field).toBe(field);
    });

    it('should toggle underlying group container', () => {
        let container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.GROUP,
            params: {
                allowCollapse: true
            }
        }));

        widget.content = container;

        expect(container.isExpanded).toBeTruthy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeFalsy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeTruthy();
    });

    it('should toggle only collapsible container', () => {
        let container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.GROUP
        }));

        widget.content = container;

        expect(container.isExpanded).toBeTruthy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeTruthy();
    });

    it('should toggle only group container', () => {

        let container = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(), {
            type: FormFieldTypes.CONTAINER,
            params: {
                allowCollapse: true
            }
        }));

        widget.content = container;

        expect(container.isExpanded).toBeTruthy();
        widget.onExpanderClicked();
        expect(container.isExpanded).toBeTruthy();
    });

    it('should send an event when a value is changed in the form', (done) => {
        let fakeForm = new FormModel();
        let fakeField = new FormFieldModel(fakeForm, {id: 'fakeField', value: 'fakeValue'});
        widget.fieldChanged.subscribe(field => {
            expect(field).not.toBe(null);
            expect(field.id).toBe('fakeField');
            expect(field.value).toBe('fakeValue');
            done();
        });

        widget.onFieldChanged(fakeField);
    });

    describe('when template is ready', () => {
        let fakeContainerVisible;
        let fakeContainerInvisible;

        beforeEach(() => {
            fakeContainerVisible = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(fakeFormJson), {
                fieldType: FormFieldTypes.GROUP,
                id: 'fake-cont-id-1',
                name: 'fake-cont-1-name',
                type: FormFieldTypes.GROUP
            }));
            fakeContainerInvisible = new ContainerWidgetComponentModel(new FormFieldModel(new FormModel(fakeFormJson), {
                fieldType: FormFieldTypes.GROUP,
                id: 'fake-cont-id-2',
                name: 'fake-cont-2-name',
                type: FormFieldTypes.GROUP
            }));
            fakeContainerVisible.field.isVisible = true;
            fakeContainerInvisible.field.isVisible = false;
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show the container header when it is visible', () => {
            widget.content = fakeContainerVisible;
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('.container-widget__header').classList.contains('hidden')).toBe(false);
                    expect(element.querySelector('#container-header-label')).toBeDefined();
                    expect(element.querySelector('#container-header-label').innerHTML).toContain('fake-cont-1-name');
                });
        });

        it('should not show the container header when it is not visible', () => {
            widget.content = fakeContainerInvisible;
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('.container-widget__header').classList.contains('hidden')).toBe(true);
                });
        });

        it('should hide header when it becomes not visible', async(() => {
            widget.content = fakeContainerVisible;
            fixture.detectChanges();
            widget.fieldChanged.subscribe((res) => {
                widget.content.field.isVisible = false;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('.container-widget__header').classList.contains('hidden')).toBe(true);
                    });
            });
            widget.onFieldChanged(null);
        }));

        it('should show header when it becomes visible', async(() => {
            widget.content = fakeContainerInvisible;
            widget.fieldChanged.subscribe((res) => {
                widget.content.field.isVisible = true;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#container-header')).toBeDefined();
                        expect(element.querySelector('#container-header')).not.toBeNull();
                        expect(element.querySelector('#container-header-label')).toBeDefined();
                        expect(element.querySelector('#container-header-label').innerHTML).toContain('fake-cont-2-name');
                    });
            });
            widget.onFieldChanged(null);
        }));

    });

});
