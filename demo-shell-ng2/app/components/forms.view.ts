import {Component} from 'angular2/core';
import {FormDesignSurface} from "./form-design-surface.component";

@Component({
    selector: 'forms-view',
    template: `
        <div class="container" style="width:970px;">
            <div class="row">
                <div class="col-md-12">
                    <!-- Design surface -->
                    <form-design-surface></form-design-surface>
                </div>
            </div>
        </div>
    `,
    directives: [FormDesignSurface]
})
export class FormsView {
    /*
     @ViewChild(FormDesignSurface)
     private _surface: FormDesignSurface;
     */
}
