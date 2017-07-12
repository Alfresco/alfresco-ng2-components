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

/* tslint:disable */

import { Component, NgModule } from '@angular/core';
import { WidgetComponent } from 'ng2-activiti-form';

@Component({
    selector: 'custom-editor',
    template: `
        <div style="color: red">Look, I'm a custom editor!</div>
    `
})
export class CustomEditorComponent extends WidgetComponent {

    constructor() {
        super();
    }
}

@Component({
    selector: 'custom-stencil-01',
    template: `<div style="color: green">ADF version of custom Activiti stencil</div>`
})
export class CustomStencil01 extends WidgetComponent {

    constructor() {
        super();
    }
}

@NgModule({
    declarations: [ CustomEditorComponent, CustomStencil01 ],
    exports: [ CustomEditorComponent, CustomStencil01 ],
    entryComponents: [ CustomEditorComponent, CustomStencil01 ]
})
export class CustomEditorsModule {

}
