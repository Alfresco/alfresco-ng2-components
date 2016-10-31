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
import * as diagramsEventsMock from '../assets/diagramEvents.mock';

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

    describe('Diagrams component Events: ', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
            component.processDefinitionId = 'fakeprocess:24:38399';
            component.metricPercentages = {startEvent: 0};
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Start Event', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).not.toBeNull();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsEventsMock.startEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Timer Event', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-timer > raphael-icon-timer');
                    expect(iconEvent).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsEventsMock.startTimeEvent]};

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Signal Event', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-signal > raphael-icon-signal');
                    expect(iconEvent).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsEventsMock.startSignalEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Message Event', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-message > raphael-icon-message');
                    expect(iconEvent).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsEventsMock.startMessageEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the Start Error Event', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-start-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-start-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsEventsMock.startErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the End Event', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsEventsMock.endEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));

        it('Should render the End Error Event', async(() => {
            component.onSuccess.subscribe((res) => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(res).toBeDefined();
                    let event: any = element.querySelector('diagram-end-event > diagram-event > raphael-circle');
                    expect(event).not.toBeNull();

                    let iconEvent: any = element.querySelector('diagram-end-event > diagram-event >' +
                        ' diagram-container-icon-event > div > div > diagram-icon-error > raphael-icon-error');
                    expect(iconEvent).not.toBeNull();
                });
            });
            component.ngOnChanges();
            let resp = {elements: [diagramsEventsMock.endErrorEvent]};
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: resp
            });
        }));
    });
});
