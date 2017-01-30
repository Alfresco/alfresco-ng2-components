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
var MediaPlayerComponent = (function () {
    function MediaPlayerComponent() {
    }
    MediaPlayerComponent.prototype.ngOnChanges = function (changes) {
        if (!this.urlFile) {
            throw new Error('Attribute urlFile is required');
        }
    };
    return MediaPlayerComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MediaPlayerComponent.prototype, "urlFile", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MediaPlayerComponent.prototype, "mimeType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MediaPlayerComponent.prototype, "nameFile", void 0);
MediaPlayerComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'media-player',
        template: "<div class=\"viewer-video-content\">     <div class=\"viewer-video-row\">         <div class=\"viewer-video-cell\">             <video controls  >                 <source [src]=\"urlFile\" [type]=\"mimeType\" />             </video>         </div>     </div> </div>",
        styles: [".viewer-video-row {     display: -webkit-box;     display: -moz-box;     display: -ms-flexbox;     display: -webkit-flex;     display: flex;      -webkit-box-orient: horizontal;     -moz-box-orient: horizontal;     box-orient: horizontal;     flex-direction: row;      -webkit-box-pack: center;     -moz-box-pack: center;     box-pack: center;     justify-content: center;      -webkit-box-align: center;     -moz-box-align: center;     box-align: center;     align-items: center; }  .viewer-video-cell {     -webkit-box-flex: 1;     -moz-box-flex: 1;     box-flex: 1;     -webkit-flex: 1 1 auto;     flex: 1 1 auto;      padding: 10px;     margin: 10px;      text-align: center; }  video {     max-height: 80vh;     display: flex;     flex-direction: row;     flex-wrap: nowrap;     justify-content: center;     align-items: center;     align-content: center;     max-width: 100%;     margin-left: auto;     margin-right: auto; }"]
    }),
    __metadata("design:paramtypes", [])
], MediaPlayerComponent);
exports.MediaPlayerComponent = MediaPlayerComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmV0cy9tZWRpYVBsYXllci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOzs7Ozs7Ozs7OztBQUVILHNDQUFpRDtBQVFqRCxJQUFhLG9CQUFvQjtJQUFqQztJQWlCQSxDQUFDO0lBTkcsMENBQVcsR0FBWCxVQUFZLE9BQU87UUFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUNyRCxDQUFDO0lBQ0wsQ0FBQztJQUVMLDJCQUFDO0FBQUQsQ0FqQkEsQUFpQkMsSUFBQTtBQWRHO0lBREMsWUFBSyxFQUFFOztxREFDUTtBQUdoQjtJQURDLFlBQUssRUFBRTs7c0RBQ1M7QUFHakI7SUFEQyxZQUFLLEVBQUU7O3NEQUNTO0FBVFIsb0JBQW9CO0lBTmhDLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDbkIsUUFBUSxFQUFFLGNBQWM7UUFDeEIsUUFBUSxFQUFFLDJRQUEyUTtRQUNyUixNQUFNLEVBQUUsQ0FBQyxvNkJBQW82QixDQUFDO0tBQ2o3QixDQUFDOztHQUNXLG9CQUFvQixDQWlCaEM7QUFqQlksb0RBQW9CIiwiZmlsZSI6ImNvbXBvbmV0cy9tZWRpYVBsYXllci5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc2VsZWN0b3I6ICdtZWRpYS1wbGF5ZXInLFxuICAgIHRlbXBsYXRlOiBcIjxkaXYgY2xhc3M9XFxcInZpZXdlci12aWRlby1jb250ZW50XFxcIj4gICAgIDxkaXYgY2xhc3M9XFxcInZpZXdlci12aWRlby1yb3dcXFwiPiAgICAgICAgIDxkaXYgY2xhc3M9XFxcInZpZXdlci12aWRlby1jZWxsXFxcIj4gICAgICAgICAgICAgPHZpZGVvIGNvbnRyb2xzICA+ICAgICAgICAgICAgICAgICA8c291cmNlIFtzcmNdPVxcXCJ1cmxGaWxlXFxcIiBbdHlwZV09XFxcIm1pbWVUeXBlXFxcIiAvPiAgICAgICAgICAgICA8L3ZpZGVvPiAgICAgICAgIDwvZGl2PiAgICAgPC9kaXY+IDwvZGl2PlwiLFxuICAgIHN0eWxlczogW1wiLnZpZXdlci12aWRlby1yb3cgeyAgICAgZGlzcGxheTogLXdlYmtpdC1ib3g7ICAgICBkaXNwbGF5OiAtbW96LWJveDsgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94OyAgICAgZGlzcGxheTogLXdlYmtpdC1mbGV4OyAgICAgZGlzcGxheTogZmxleDsgICAgICAtd2Via2l0LWJveC1vcmllbnQ6IGhvcml6b250YWw7ICAgICAtbW96LWJveC1vcmllbnQ6IGhvcml6b250YWw7ICAgICBib3gtb3JpZW50OiBob3Jpem9udGFsOyAgICAgZmxleC1kaXJlY3Rpb246IHJvdzsgICAgICAtd2Via2l0LWJveC1wYWNrOiBjZW50ZXI7ICAgICAtbW96LWJveC1wYWNrOiBjZW50ZXI7ICAgICBib3gtcGFjazogY2VudGVyOyAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7ICAgICAgLXdlYmtpdC1ib3gtYWxpZ246IGNlbnRlcjsgICAgIC1tb3otYm94LWFsaWduOiBjZW50ZXI7ICAgICBib3gtYWxpZ246IGNlbnRlcjsgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7IH0gIC52aWV3ZXItdmlkZW8tY2VsbCB7ICAgICAtd2Via2l0LWJveC1mbGV4OiAxOyAgICAgLW1vei1ib3gtZmxleDogMTsgICAgIGJveC1mbGV4OiAxOyAgICAgLXdlYmtpdC1mbGV4OiAxIDEgYXV0bzsgICAgIGZsZXg6IDEgMSBhdXRvOyAgICAgIHBhZGRpbmc6IDEwcHg7ICAgICBtYXJnaW46IDEwcHg7ICAgICAgdGV4dC1hbGlnbjogY2VudGVyOyB9ICB2aWRlbyB7ICAgICBtYXgtaGVpZ2h0OiA4MHZoOyAgICAgZGlzcGxheTogZmxleDsgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7ICAgICBmbGV4LXdyYXA6IG5vd3JhcDsgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyOyAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjsgICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjsgICAgIG1heC13aWR0aDogMTAwJTsgICAgIG1hcmdpbi1sZWZ0OiBhdXRvOyAgICAgbWFyZ2luLXJpZ2h0OiBhdXRvOyB9XCJdXG59KVxuZXhwb3J0IGNsYXNzIE1lZGlhUGxheWVyQ29tcG9uZW50IHtcblxuICAgIEBJbnB1dCgpXG4gICAgdXJsRmlsZTogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBtaW1lVHlwZTogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBuYW1lRmlsZTogc3RyaW5nO1xuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgICAgICBpZiAoIXRoaXMudXJsRmlsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgdXJsRmlsZSBpcyByZXF1aXJlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=
