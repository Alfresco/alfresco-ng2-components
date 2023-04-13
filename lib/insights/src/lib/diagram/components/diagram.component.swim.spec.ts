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

import * as swimLanesMock from '../../mock/diagram/diagram-swimlanes.mock';
import { DiagramComponent } from './diagram.component';
import { setupTestBed } from '@alfresco/adf-core';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('Diagrams swim', () => {

    let component: any;
    let fixture: ComponentFixture<DiagramComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            InsightsTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DiagramComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    beforeEach(() => {
        jasmine.Ajax.install();
        component.processInstanceId = '38399';
        component.processDefinitionId = 'fakeprocess:24:38399';
        component.metricPercentages = { startEvent: 0 };
    });

    afterEach(() => {
        component.success.unsubscribe();
        fixture.destroy();
        jasmine.Ajax.uninstall();
    });

    const ajaxReply =  (resp: any) => {
        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: resp
        });
    };

    describe('Diagrams component Swim lane: ', () => {

        it('Should render the Pool', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-pool > raphael-rect');
                    expect(shape).not.toBeNull();

                    const shapeText: any = element.querySelector('diagram-pool > raphael-text');
                    expect(shapeText).not.toBeNull();
                    expect(shapeText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Activiti');
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { pools: [swimLanesMock.pool] };
            ajaxReply(resp);
        });

        it('Should render the Pool with Lanes', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shapeLane: any = element.querySelector('diagram-lanes > div > div > diagram-lane');
                    expect(shapeLane).not.toBeNull();

                    const shapeRect: any = element.querySelector('diagram-lanes > div > div > diagram-lane > raphael-rect');
                    expect(shapeRect).not.toBeNull();

                    const shapeText: any = element.querySelector('diagram-lanes > div > div > diagram-lane > raphael-text');
                    expect(shapeText).not.toBeNull();
                    expect(shapeText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Backend');
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { pools: [swimLanesMock.poolLanes] };
            ajaxReply(resp);
        });
    });

    describe('Diagrams component Swim lane with process instance id: ', () => {

        it('Should render the Pool', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('diagram-pool > raphael-rect');
                    expect(shape).not.toBeNull();

                    const shapeText: any = element.querySelector('diagram-pool > raphael-text');
                    expect(shapeText).not.toBeNull();
                    expect(shapeText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Activiti');
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { pools: [swimLanesMock.pool] };
            ajaxReply(resp);
        });

        it('Should render the Pool with Lanes', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shapeLane: any = element.querySelector('diagram-lanes > div > div > diagram-lane');
                    expect(shapeLane).not.toBeNull();

                    const shapeRect: any = element.querySelector('diagram-lanes > div > div > diagram-lane > raphael-rect');
                    expect(shapeRect).not.toBeNull();

                    const shapeText: any = element.querySelector('diagram-lanes > div > div > diagram-lane > raphael-text');
                    expect(shapeText).not.toBeNull();
                    expect(shapeText.attributes.getNamedItem('ng-reflect-text').value).toEqual('Backend');
                    done();
                });
            });
            component.ngOnChanges();
            const resp = { pools: [swimLanesMock.poolLanes] };
            ajaxReply(resp);
        });
    });
});
