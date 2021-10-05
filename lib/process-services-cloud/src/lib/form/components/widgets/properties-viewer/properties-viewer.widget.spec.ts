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
    FormModel,
    setupTestBed
} from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesViewerWidgetComponent } from './properties-viewer.widget';
import { ProcessServiceCloudTestingModule } from 'process-services-cloud/src/lib/testing/process-service-cloud.testing.module';
import { fakeNodeWithProperties } from '../../../mocks/attach-file-cloud-widget.mock';

describe('PropertiesViewerWidgetComponent', () => {
    let widget: PropertiesViewerWidgetComponent;
    let fixture: ComponentFixture<PropertiesViewerWidgetComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerWidgetComponent);
        widget = fixture.componentInstance;
        element = fixture.nativeElement;

        widget.field = new FormFieldModel(new FormModel());
    });

    afterEach(() => fixture.destroy());

    it('should not display properties viewer when value is not set', async () => {
        widget.field.value = undefined;

        fixture.detectChanges();
        await fixture.whenStable();

        const propertiesViewer = element.querySelector('properties-viewer-wrapper');

        expect(propertiesViewer).toBeNull();
    });

    it('should display properties viewer when value is set', async () => {
        widget.field.value = '1234';

        fixture.detectChanges();
        await fixture.whenStable();

        const propertiesViewer = element.querySelector('properties-viewer-wrapper');

        expect(propertiesViewer).not.toBeNull();
    });

    it('should emit the node when node content is loaded', async () => {
        const nodeContentLoadedSpy = spyOn(widget.nodeContentLoaded, 'emit');

        widget.onNodeContentLoaded(fakeNodeWithProperties);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(nodeContentLoadedSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
    });
});
