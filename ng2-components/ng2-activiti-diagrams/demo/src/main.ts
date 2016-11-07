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

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CoreModule } from 'ng2-alfresco-core';
import { DiagramsModule } from 'ng2-activiti-diagrams';

@Component({
    selector: 'activiti-diagrams-demo',
    template: `
    <label for="processDefinitionId"><b>Insert the ProcessDefinitionId:</b></label><br>
    <input id="processDefinitionId" size="70" type="text" [(ngModel)]="processDefinitionId">
    <activiti-diagram [processDefinitionId]="processDefinitionId"></activiti-diagram>`
})

export class DiagramDemoComponent {

    private processDefinitionId: string;

    ngOnInit() {
        this.processDefinitionId = 'ThirdProcess:1:15053';
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        DiagramsModule
    ],
    declarations: [ DiagramDemoComponent ],
    bootstrap:    [ DiagramDemoComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
