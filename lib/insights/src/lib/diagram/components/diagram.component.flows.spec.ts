/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import * as flowsMock from '../../mock/diagram/diagram-flows.mock';
import { DiagramComponent } from './diagram.component';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { DiagramsService } from '../services/diagrams.service';
import { of } from 'rxjs';

describe('Diagrams flows', () => {
    let component: any;
    let fixture: ComponentFixture<DiagramComponent>;
    let element: HTMLElement;
    let diagramsService: DiagramsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [InsightsTestingModule]
        });
        fixture = TestBed.createComponent(DiagramComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        diagramsService = TestBed.inject(DiagramsService);
        fixture.detectChanges();

        component.processInstanceId = '38399';
        component.processDefinitionId = 'fakeprocess:24:38399';
        component.metricPercentages = { startEvent: 0 };
    });

    afterEach(() => {
        component.success.unsubscribe();
        fixture.destroy();
    });

    describe('Diagrams component Flows with process instance id: ', () => {
        it('Should render the flow', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('adf-diagram-sequence-flow > raphael-flow-arrow');
                    expect(shape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.flows[0].id);
                    expect(tooltip.textContent).toContain(res.flows[0].type);
                    done();
                });
            });
            const resp = { flows: [flowsMock.flow] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });
    });

    describe('Diagrams component Flows: ', () => {
        it('Should render the flow', (done) => {
            component.success.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    const shape: any = element.querySelector('adf-diagram-sequence-flow > raphael-flow-arrow');
                    expect(shape).not.toBeNull();

                    const tooltip: any = element.querySelector('diagram-tooltip > div');
                    expect(tooltip.textContent).toContain(res.flows[0].id);
                    expect(tooltip.textContent).toContain(res.flows[0].type);
                    done();
                });
            });
            const resp = { flows: [flowsMock.flow] };
            spyOn(diagramsService, 'getProcessDefinitionModel').and.returnValue(of(resp));
            component.ngOnChanges();
        });
    });
});
