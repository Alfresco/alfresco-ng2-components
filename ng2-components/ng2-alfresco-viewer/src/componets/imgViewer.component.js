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
var ImgViewerComponent = (function () {
    function ImgViewerComponent() {
    }
    ImgViewerComponent.prototype.ngOnChanges = function (changes) {
        if (!this.urlFile) {
            throw new Error('Attribute urlFile is required');
        }
    };
    return ImgViewerComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ImgViewerComponent.prototype, "urlFile", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ImgViewerComponent.prototype, "nameFile", void 0);
ImgViewerComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'img-viewer',
        template: "<div class=\"viewer-image-content\">     <div class=\"viewer-image-row\">         <div class=\"viewer-image-cell\">             <img id=\"viewer-image\" src=\"{{urlFile}}\"  alt=\"{{nameFile}}\" class=\"center-element viewer-image\"/>         </div>     </div> </div>",
        styles: [".viewer-image-row {     display: -webkit-box;     display: -moz-box;     display: -ms-flexbox;     display: -webkit-flex;     display: flex;      -webkit-box-orient: horizontal;     -moz-box-orient: horizontal;     box-orient: horizontal;     flex-direction: row;      -webkit-box-pack: center;     -moz-box-pack: center;     box-pack: center;     justify-content: center;      -webkit-box-align: center;     -moz-box-align: center;     box-align: center;     align-items: center; }  .viewer-image-cell {     -webkit-box-flex: 1;     -moz-box-flex: 1;     box-flex: 1;     -webkit-flex: 1 1 auto;     flex: 1 1 auto;      padding: 10px;     margin: 10px;      text-align: center; }  .viewer-image {     height: 80vh;     max-width:100%; }"]
    }),
    __metadata("design:paramtypes", [])
], ImgViewerComponent);
exports.ImgViewerComponent = ImgViewerComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmV0cy9pbWdWaWV3ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBaUQ7QUFRakQsSUFBYSxrQkFBa0I7SUFBL0I7SUFhQSxDQUFDO0lBTEcsd0NBQVcsR0FBWCxVQUFZLE9BQU87UUFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0wsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FiQSxBQWFDLElBQUE7QUFWRztJQURDLFlBQUssRUFBRTs7bURBQ1E7QUFHaEI7SUFEQyxZQUFLLEVBQUU7O29EQUNTO0FBTlIsa0JBQWtCO0lBTjlCLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsUUFBUSxFQUFFLFlBQVk7UUFDdEIsUUFBUSxFQUFFLDZRQUE2UTtRQUN2UixNQUFNLEVBQUUsQ0FBQyxvdUJBQW91QixDQUFDO0tBQ2p2QixDQUFDOztHQUNXLGtCQUFrQixDQWE5QjtBQWJZLGdEQUFrQiIsImZpbGUiOiJjb21wb25ldHMvaW1nVmlld2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzZWxlY3RvcjogJ2ltZy12aWV3ZXInLFxuICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9XFxcInZpZXdlci1pbWFnZS1jb250ZW50XFxcIj4gICAgIDxkaXYgY2xhc3M9XFxcInZpZXdlci1pbWFnZS1yb3dcXFwiPiAgICAgICAgIDxkaXYgY2xhc3M9XFxcInZpZXdlci1pbWFnZS1jZWxsXFxcIj4gICAgICAgICAgICAgPGltZyBpZD1cXFwidmlld2VyLWltYWdlXFxcIiBzcmM9XFxcInt7dXJsRmlsZX19XFxcIiAgYWx0PVxcXCJ7e25hbWVGaWxlfX1cXFwiIGNsYXNzPVxcXCJjZW50ZXItZWxlbWVudCB2aWV3ZXItaW1hZ2VcXFwiLz4gICAgICAgICA8L2Rpdj4gICAgIDwvZGl2PiA8L2Rpdj5cIixcbiAgICBzdHlsZXM6IFtcIi52aWV3ZXItaW1hZ2Utcm93IHsgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94OyAgICAgZGlzcGxheTogLW1vei1ib3g7ICAgICBkaXNwbGF5OiAtbXMtZmxleGJveDsgICAgIGRpc3BsYXk6IC13ZWJraXQtZmxleDsgICAgIGRpc3BsYXk6IGZsZXg7ICAgICAgLXdlYmtpdC1ib3gtb3JpZW50OiBob3Jpem9udGFsOyAgICAgLW1vei1ib3gtb3JpZW50OiBob3Jpem9udGFsOyAgICAgYm94LW9yaWVudDogaG9yaXpvbnRhbDsgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7ICAgICAgLXdlYmtpdC1ib3gtcGFjazogY2VudGVyOyAgICAgLW1vei1ib3gtcGFjazogY2VudGVyOyAgICAgYm94LXBhY2s6IGNlbnRlcjsgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyOyAgICAgIC13ZWJraXQtYm94LWFsaWduOiBjZW50ZXI7ICAgICAtbW96LWJveC1hbGlnbjogY2VudGVyOyAgICAgYm94LWFsaWduOiBjZW50ZXI7ICAgICBhbGlnbi1pdGVtczogY2VudGVyOyB9ICAudmlld2VyLWltYWdlLWNlbGwgeyAgICAgLXdlYmtpdC1ib3gtZmxleDogMTsgICAgIC1tb3otYm94LWZsZXg6IDE7ICAgICBib3gtZmxleDogMTsgICAgIC13ZWJraXQtZmxleDogMSAxIGF1dG87ICAgICBmbGV4OiAxIDEgYXV0bzsgICAgICBwYWRkaW5nOiAxMHB4OyAgICAgbWFyZ2luOiAxMHB4OyAgICAgIHRleHQtYWxpZ246IGNlbnRlcjsgfSAgLnZpZXdlci1pbWFnZSB7ICAgICBoZWlnaHQ6IDgwdmg7ICAgICBtYXgtd2lkdGg6MTAwJTsgfVwiXVxufSlcbmV4cG9ydCBjbGFzcyBJbWdWaWV3ZXJDb21wb25lbnQge1xuXG4gICAgQElucHV0KClcbiAgICB1cmxGaWxlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIG5hbWVGaWxlOiBzdHJpbmc7XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgICAgIGlmICghdGhpcy51cmxGaWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dHJpYnV0ZSB1cmxGaWxlIGlzIHJlcXVpcmVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
