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
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var NotSupportedFormat = (function () {
    function NotSupportedFormat() {
    }
    NotSupportedFormat.prototype.download = function () {
        window.open(this.urlFile);
    };
    return NotSupportedFormat;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], NotSupportedFormat.prototype, "nameFile", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], NotSupportedFormat.prototype, "urlFile", void 0);
NotSupportedFormat = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'not-supported-format',
        template: "<section class=\"section--center mdl-grid mdl-grid--no-spacing\">     <div class=\"viewer-margin mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone mdl-shadow--2dp\">         <div class=\"viewer-download-text mdl-card__supporting-text full_width\">             <h4>File <span>{{nameFile}}</span> is an unsupported format</h4>         </div>         <div class=\"center-element mdl-card__actions\">             <button id=\"viewer-download-button\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" (click)=\"download()\">                 <i class=\"viewer-margin-cloud-download material-icons\">cloud_download</i>   Download             </button>         </div>     </div> </section>",
        styles: [" .viewer-download-text  {     text-align: center; }  .viewer-margin-cloud-download{     margin-right: 20px; }  .viewer-margin {     margin: auto !important; }  .center-element {     display: flex;     align-items: center;     justify-content: center; }  .full_width{     width :100% !important; }"]
    }),
    __metadata("design:paramtypes", [])
], NotSupportedFormat);
exports.NotSupportedFormat = NotSupportedFormat;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmV0cy9ub3RTdXBwb3J0ZWRGb3JtYXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBaUQ7QUFRakQsSUFBYSxrQkFBa0I7SUFBL0I7SUFjQSxDQUFDO0lBSEcscUNBQVEsR0FBUjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDTCx5QkFBQztBQUFELENBZEEsQUFjQyxJQUFBO0FBWEc7SUFEQyxZQUFLLEVBQUU7O29EQUNTO0FBR2pCO0lBREMsWUFBSyxFQUFFOzttREFDUTtBQU5QLGtCQUFrQjtJQU45QixnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQ25CLFFBQVEsRUFBRSxzQkFBc0I7UUFDaEMsUUFBUSxFQUFFLDZ2QkFBNnZCO1FBQ3Z3QixNQUFNLEVBQUUsQ0FBQywwU0FBMFMsQ0FBQztLQUN2VCxDQUFDOztHQUNXLGtCQUFrQixDQWM5QjtBQWRZLGdEQUFrQiIsImZpbGUiOiJjb21wb25ldHMvbm90U3VwcG9ydGVkRm9ybWF0LmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzZWxlY3RvcjogJ25vdC1zdXBwb3J0ZWQtZm9ybWF0JyxcbiAgICB0ZW1wbGF0ZTogXCI8c2VjdGlvbiBjbGFzcz1cXFwic2VjdGlvbi0tY2VudGVyIG1kbC1ncmlkIG1kbC1ncmlkLS1uby1zcGFjaW5nXFxcIj4gICAgIDxkaXYgY2xhc3M9XFxcInZpZXdlci1tYXJnaW4gbWRsLWNhcmQgbWRsLWNlbGwgbWRsLWNlbGwtLTktY29sLWRlc2t0b3AgbWRsLWNlbGwtLTYtY29sLXRhYmxldCBtZGwtY2VsbC0tNC1jb2wtcGhvbmUgbWRsLXNoYWRvdy0tMmRwXFxcIj4gICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ2aWV3ZXItZG93bmxvYWQtdGV4dCBtZGwtY2FyZF9fc3VwcG9ydGluZy10ZXh0IGZ1bGxfd2lkdGhcXFwiPiAgICAgICAgICAgICA8aDQ+RmlsZSA8c3Bhbj57e25hbWVGaWxlfX08L3NwYW4+IGlzIGFuIHVuc3VwcG9ydGVkIGZvcm1hdDwvaDQ+ICAgICAgICAgPC9kaXY+ICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY2VudGVyLWVsZW1lbnQgbWRsLWNhcmRfX2FjdGlvbnNcXFwiPiAgICAgICAgICAgICA8YnV0dG9uIGlkPVxcXCJ2aWV3ZXItZG93bmxvYWQtYnV0dG9uXFxcIiBjbGFzcz1cXFwibWRsLWJ1dHRvbiBtZGwtanMtYnV0dG9uIG1kbC1idXR0b24tLXJhaXNlZCBtZGwtanMtcmlwcGxlLWVmZmVjdCBtZGwtYnV0dG9uLS1hY2NlbnRcXFwiIChjbGljayk9XFxcImRvd25sb2FkKClcXFwiPiAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XFxcInZpZXdlci1tYXJnaW4tY2xvdWQtZG93bmxvYWQgbWF0ZXJpYWwtaWNvbnNcXFwiPmNsb3VkX2Rvd25sb2FkPC9pPiAgIERvd25sb2FkICAgICAgICAgICAgIDwvYnV0dG9uPiAgICAgICAgIDwvZGl2PiAgICAgPC9kaXY+IDwvc2VjdGlvbj5cIixcbiAgICBzdHlsZXM6IFtcIiAudmlld2VyLWRvd25sb2FkLXRleHQgIHsgICAgIHRleHQtYWxpZ246IGNlbnRlcjsgfSAgLnZpZXdlci1tYXJnaW4tY2xvdWQtZG93bmxvYWR7ICAgICBtYXJnaW4tcmlnaHQ6IDIwcHg7IH0gIC52aWV3ZXItbWFyZ2luIHsgICAgIG1hcmdpbjogYXV0byAhaW1wb3J0YW50OyB9ICAuY2VudGVyLWVsZW1lbnQgeyAgICAgZGlzcGxheTogZmxleDsgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7ICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgfSAgLmZ1bGxfd2lkdGh7ICAgICB3aWR0aCA6MTAwJSAhaW1wb3J0YW50OyB9XCJdXG59KVxuZXhwb3J0IGNsYXNzIE5vdFN1cHBvcnRlZEZvcm1hdCB7XG5cbiAgICBASW5wdXQoKVxuICAgIG5hbWVGaWxlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIHVybEZpbGU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIERvd25sb2FkIGZpbGUgb3BlbmluZyBpdCBpbiBhIG5ldyB3aW5kb3dcbiAgICAgKi9cbiAgICBkb3dubG9hZCgpIHtcbiAgICAgICAgd2luZG93Lm9wZW4odGhpcy51cmxGaWxlKTtcbiAgICB9XG59XG4iXX0=
