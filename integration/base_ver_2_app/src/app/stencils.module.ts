/* tslint:disable */

import { Component, NgModule } from '@angular/core';
import { WidgetComponent } from '@alfresco/adf-core';

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
    declarations: [
      CustomEditorComponent,
      CustomStencil01
    ],
    exports: [
      CustomEditorComponent,
      CustomStencil01
    ],
    entryComponents: [
      CustomEditorComponent,
      CustomStencil01
    ]
})
export class StencilsModule {}
