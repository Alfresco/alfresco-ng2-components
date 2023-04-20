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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    setupTestBed
} from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { PropertiesViewerWrapperComponent } from './properties-viewer-wrapper.component';
import { ProcessServiceCloudTestingModule } from '../../../../../testing/process-service-cloud.testing.module';
import { of } from 'rxjs';
import { fakeNodeWithProperties } from '../../../../mocks/attach-file-cloud-widget.mock';
import { NodesApiService, BasicPropertiesService } from '@alfresco/adf-content-services';

describe('PropertiesViewerWidgetComponent', () => {
    let component: PropertiesViewerWrapperComponent;
    let fixture: ComponentFixture<PropertiesViewerWrapperComponent>;
    let nodesApiService: NodesApiService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        providers: [
            NodesApiService,
            { provide: BasicPropertiesService, useValue: { getProperties: () => [] } }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerWrapperComponent);
        component = fixture.componentInstance;

        nodesApiService = TestBed.inject(NodesApiService);
    });

    afterEach(() => fixture.destroy());

    it('should retrieve the node when initializing the component', async () => {
        component.nodeId = '1234';
        const nodesApiServiceSpy = spyOn(nodesApiService, 'getNode').and.returnValue(of(fakeNodeWithProperties));

        component.ngOnInit();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(nodesApiServiceSpy).toHaveBeenCalledWith('1234');
    });

    it('should retrieve the node when the nodeId changes', async () => {
        const nodesApiServiceSpy = spyOn(nodesApiService, 'getNode').and.returnValue(of(fakeNodeWithProperties));

        component.ngOnChanges({ nodeId: { isFirstChange: () => false, currentValue: '1234', previousValue: undefined, firstChange: false } });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(nodesApiServiceSpy).toHaveBeenCalledWith('1234');
    });

    it('should emit the node when node is retrieved', async () => {
        component.nodeId = '1234';
        spyOn(nodesApiService, 'getNode').and.returnValue(of(fakeNodeWithProperties));
        const nodeContentLoadedSpy = spyOn(component.nodeContentLoaded, 'emit');

        component.ngOnInit();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(nodeContentLoadedSpy).toHaveBeenCalledWith(fakeNodeWithProperties);
    });
});
