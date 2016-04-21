import {Component} from 'angular2/core';
import {MDL} from './MaterialDesignLiteUpgradeElement';

@Component({
    selector: 'page2-view',
    template: `
        <div class="container">
            <div class="row">
                <h2>Page 2</h2>
                <label mdl class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-1">
                  <input type="checkbox" id="checkbox-1" class="mdl-checkbox__input" checked>
                  <span class="mdl-checkbox__label">Checkbox</span>
                </label>
            </div>
        </div>
    `,
    directives: [MDL]
})
export class Page2View {

}
