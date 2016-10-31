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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import {
    CoreModule
} from 'ng2-alfresco-core';

import { DIAGRAM_DIRECTIVES, DIAGRAM_PROVIDERS } from './index';
import { RAPHAEL_DIRECTIVES, RAPHAEL_PROVIDERS } from './raphael/index';
import { DiagramComponent } from './index';
import { DebugElement } from '@angular/core';

declare let jasmine: any;

describe('Test ng2-activiti-diagrams ', () => {

    let component: any;
    let fixture: ComponentFixture<DiagramComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    let componentHandler: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                ...DIAGRAM_DIRECTIVES,
                ...RAPHAEL_DIRECTIVES
            ],
            providers: [
                ...DIAGRAM_PROVIDERS,
                ...RAPHAEL_PROVIDERS
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiagramComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        fixture.detectChanges();
        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);
        window['componentHandler'] = componentHandler;
    });

    describe('Diagrams component ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the StartEvent', async(() => {
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};

            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let startEvent: any = element.querySelector('diagram-start-event');
                    expect(startEvent).toBeDefined();
                    let raphaelCircle: any = element.querySelector('raphael-circle');
                    expect(raphaelCircle).toBeDefined();
                });
            });
            component.ngOnChanges();
            let startEvent = {
                id: 'startEvent1',
                type: 'StartEvent',
                width: 30,
                height: 30,
                x: 15,
                y: 48.5,
                properties: [{}]
            };
            let resp = {elements : [startEvent] };

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });
});
