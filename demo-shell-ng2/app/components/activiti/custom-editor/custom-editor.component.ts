import { NgModule, Component, ElementRef } from '@angular/core';
import { TextFieldWidgetComponent } from 'ng2-activiti-form';

@Component({
    selector: 'custom-editor',
    template: `
        <div style="color: red">Look, I'm a custom editor!</div>
    `
})
export class CustomEditorComponent extends TextFieldWidgetComponent {

    constructor(elementRef: ElementRef) {
        super(elementRef);
    }

}

@NgModule({
    declarations: [ CustomEditorComponent ],
    exports: [ CustomEditorComponent ],
    entryComponents: [ CustomEditorComponent ]
})
export class CustomEditorsModule {}
