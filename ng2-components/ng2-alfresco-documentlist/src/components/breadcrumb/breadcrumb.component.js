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
var document_list_1 = require("../document-list");
var DocumentListBreadcrumb = (function () {
    function DocumentListBreadcrumb() {
        this._currentFolderPath = '/';
        this.rootFolder = {
            name: 'Root',
            path: '/'
        };
        this.route = [this.rootFolder];
        this.navigate = new core_1.EventEmitter();
        this.pathChanged = new core_1.EventEmitter();
    }
    Object.defineProperty(DocumentListBreadcrumb.prototype, "currentFolderPath", {
        get: function () {
            return this._currentFolderPath;
        },
        set: function (val) {
            if (this._currentFolderPath !== val) {
                if (val) {
                    this._currentFolderPath = val;
                    this.route = this.parsePath(val);
                }
                else {
                    this._currentFolderPath = this.rootFolder.path;
                    this.route = [this.rootFolder];
                }
                this.pathChanged.emit({
                    value: this._currentFolderPath,
                    route: this.route
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    DocumentListBreadcrumb.prototype.onRoutePathClick = function (route, e) {
        if (e) {
            e.preventDefault();
        }
        if (route) {
            this.navigate.emit({
                value: {
                    name: route.name,
                    path: route.path
                }
            });
            this.currentFolderPath = route.path;
            if (this.target) {
                this.target.currentFolderPath = route.path;
                this.target.loadFolder();
            }
        }
    };
    DocumentListBreadcrumb.prototype.parsePath = function (path) {
        var parts = path.split('/').filter(function (val) { return val ? true : false; });
        var result = [
            this.rootFolder
        ];
        var parentPath = this.rootFolder.path;
        for (var i = 0; i < parts.length; i++) {
            if (!parentPath.endsWith('/')) {
                parentPath += '/';
            }
            parentPath += parts[i];
            result.push({
                name: parts[i],
                path: parentPath
            });
        }
        return result;
    };
    ;
    return DocumentListBreadcrumb;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], DocumentListBreadcrumb.prototype, "currentFolderPath", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", document_list_1.DocumentList)
], DocumentListBreadcrumb.prototype, "target", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DocumentListBreadcrumb.prototype, "navigate", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DocumentListBreadcrumb.prototype, "pathChanged", void 0);
DocumentListBreadcrumb = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'alfresco-document-list-breadcrumb',
        template: "<ol data-automation-id=\"breadcrumb\" class=\"breadcrumb\">     <li *ngFor=\"let r of route; let last = last\" [class.active]=\"last\" [ngSwitch]=\"last\">         <span *ngSwitchCase=\"true\">{{r.name}}</span>         <a *ngSwitchDefault            href=\"#\"            [attr.data-automation-id]=\"'breadcrumb_' + r.name\"            (click)=\"onRoutePathClick(r, $event)\">             {{r.name}}         </a>     </li> </ol>",
        styles: ["/* breadcrumb */  :host .breadcrumb {     text-align: left;     padding: 8px 15px;     list-style: none;     background-color: #fafafa;     margin: 0 0 4px; }  :host .breadcrumb > li {     display: inline-block;     box-sizing: border-box; }  :host .breadcrumb > li+li:before {     content: \">\\00a0\";     padding: 0 0 0 5px;     opacity: 0.54;     color: #000000; }  :host .breadcrumb > li > a {     text-decoration: none;     opacity: 0.54;     font-family: 'Muli', \"Helvetica\", \"Arial\", sans-serif;     font-size: 14px;     font-weight: 600;     line-height: 1.43;     letter-spacing: -0.2px;     color: #000000; }  :host .breadcrumb > li:hover > a, :host .breadcrumb > .active {     opacity: 0.87;     font-size: 14px;     font-weight: 600;     line-height: 1.43;     letter-spacing: -0.2px;     color: #000000; }"]
    }),
    __metadata("design:paramtypes", [])
], DocumentListBreadcrumb);
exports.DocumentListBreadcrumb = DocumentListBreadcrumb;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYnJlYWRjcnVtYi9icmVhZGNydW1iLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBS3VCO0FBQ3ZCLGtEQUFnRDtBQVFoRCxJQUFhLHNCQUFzQjtJQU5uQztRQVFZLHVCQUFrQixHQUFXLEdBQUcsQ0FBQztRQTBCakMsZUFBVSxHQUFhO1lBQzNCLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLEdBQUc7U0FDWixDQUFDO1FBRUYsVUFBSyxHQUFlLENBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDO1FBR3hDLGFBQVEsR0FBc0IsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFHakQsZ0JBQVcsR0FBc0IsSUFBSSxtQkFBWSxFQUFFLENBQUM7SUErQ3hELENBQUM7SUFqRkcsc0JBQUkscURBQWlCO2FBZ0JyQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFDbkMsQ0FBQzthQWxCRCxVQUFzQixHQUFXO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUM7b0JBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7b0JBQy9DLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBRSxJQUFJLENBQUMsVUFBVSxDQUFFLENBQUM7Z0JBQ3JDLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7b0JBQ2xCLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCO29CQUM5QixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7aUJBQ3BCLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDOzs7T0FBQTtJQXNCRCxpREFBZ0IsR0FBaEIsVUFBaUIsS0FBZSxFQUFFLENBQVM7UUFDdkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNmLEtBQUssRUFBRTtvQkFDSCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7b0JBQ2hCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtpQkFDbkI7YUFDSixDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztZQUVwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDN0IsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU8sMENBQVMsR0FBakIsVUFBa0IsSUFBWTtRQUMxQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxFQUFsQixDQUFrQixDQUFDLENBQUM7UUFFOUQsSUFBSSxNQUFNLEdBQUc7WUFDVCxJQUFJLENBQUMsVUFBVTtTQUNsQixDQUFDO1FBRUYsSUFBSSxVQUFVLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFFOUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsVUFBVSxJQUFJLEdBQUcsQ0FBQztZQUN0QixDQUFDO1lBQ0QsVUFBVSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2QixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNSLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNkLElBQUksRUFBRSxVQUFVO2FBQ25CLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFBQSxDQUFDO0lBQ04sNkJBQUM7QUFBRCxDQXRGQSxBQXNGQyxJQUFBO0FBakZHO0lBREMsWUFBSyxFQUFFOzs7K0RBZVA7QUFPRDtJQURDLFlBQUssRUFBRTs4QkFDQSw0QkFBWTtzREFBQztBQVVyQjtJQURDLGFBQU0sRUFBRTs4QkFDQyxtQkFBWTt3REFBMkI7QUFHakQ7SUFEQyxhQUFNLEVBQUU7OEJBQ0ksbUJBQVk7MkRBQTJCO0FBdkMzQyxzQkFBc0I7SUFObEMsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNuQixRQUFRLEVBQUUsbUNBQW1DO1FBQzdDLFFBQVEsRUFBRSw4YUFBOGE7UUFDeGIsTUFBTSxFQUFFLENBQUMseXpCQUF5ekIsQ0FBQztLQUN0MEIsQ0FBQzs7R0FDVyxzQkFBc0IsQ0FzRmxDO0FBdEZZLHdEQUFzQiIsImZpbGUiOiJjb21wb25lbnRzL2JyZWFkY3J1bWIvYnJlYWRjcnVtYi5jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICAgIENvbXBvbmVudCxcbiAgICBJbnB1dCxcbiAgICBPdXRwdXQsXG4gICAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9jdW1lbnRMaXN0IH0gZnJvbSAnLi4vZG9jdW1lbnQtbGlzdCc7XG5cbkBDb21wb25lbnQoe1xuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgc2VsZWN0b3I6ICdhbGZyZXNjby1kb2N1bWVudC1saXN0LWJyZWFkY3J1bWInLFxuICAgIHRlbXBsYXRlOiBcIjxvbCBkYXRhLWF1dG9tYXRpb24taWQ9XFxcImJyZWFkY3J1bWJcXFwiIGNsYXNzPVxcXCJicmVhZGNydW1iXFxcIj4gICAgIDxsaSAqbmdGb3I9XFxcImxldCByIG9mIHJvdXRlOyBsZXQgbGFzdCA9IGxhc3RcXFwiIFtjbGFzcy5hY3RpdmVdPVxcXCJsYXN0XFxcIiBbbmdTd2l0Y2hdPVxcXCJsYXN0XFxcIj4gICAgICAgICA8c3BhbiAqbmdTd2l0Y2hDYXNlPVxcXCJ0cnVlXFxcIj57e3IubmFtZX19PC9zcGFuPiAgICAgICAgIDxhICpuZ1N3aXRjaERlZmF1bHQgICAgICAgICAgICBocmVmPVxcXCIjXFxcIiAgICAgICAgICAgIFthdHRyLmRhdGEtYXV0b21hdGlvbi1pZF09XFxcIidicmVhZGNydW1iXycgKyByLm5hbWVcXFwiICAgICAgICAgICAgKGNsaWNrKT1cXFwib25Sb3V0ZVBhdGhDbGljayhyLCAkZXZlbnQpXFxcIj4gICAgICAgICAgICAge3tyLm5hbWV9fSAgICAgICAgIDwvYT4gICAgIDwvbGk+IDwvb2w+XCIsXG4gICAgc3R5bGVzOiBbXCIvKiBicmVhZGNydW1iICovICA6aG9zdCAuYnJlYWRjcnVtYiB7ICAgICB0ZXh0LWFsaWduOiBsZWZ0OyAgICAgcGFkZGluZzogOHB4IDE1cHg7ICAgICBsaXN0LXN0eWxlOiBub25lOyAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZhZmFmYTsgICAgIG1hcmdpbjogMCAwIDRweDsgfSAgOmhvc3QgLmJyZWFkY3J1bWIgPiBsaSB7ICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7ICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyB9ICA6aG9zdCAuYnJlYWRjcnVtYiA+IGxpK2xpOmJlZm9yZSB7ICAgICBjb250ZW50OiBcXFwiPlxcXFwwMGEwXFxcIjsgICAgIHBhZGRpbmc6IDAgMCAwIDVweDsgICAgIG9wYWNpdHk6IDAuNTQ7ICAgICBjb2xvcjogIzAwMDAwMDsgfSAgOmhvc3QgLmJyZWFkY3J1bWIgPiBsaSA+IGEgeyAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lOyAgICAgb3BhY2l0eTogMC41NDsgICAgIGZvbnQtZmFtaWx5OiAnTXVsaScsIFxcXCJIZWx2ZXRpY2FcXFwiLCBcXFwiQXJpYWxcXFwiLCBzYW5zLXNlcmlmOyAgICAgZm9udC1zaXplOiAxNHB4OyAgICAgZm9udC13ZWlnaHQ6IDYwMDsgICAgIGxpbmUtaGVpZ2h0OiAxLjQzOyAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjJweDsgICAgIGNvbG9yOiAjMDAwMDAwOyB9ICA6aG9zdCAuYnJlYWRjcnVtYiA+IGxpOmhvdmVyID4gYSwgOmhvc3QgLmJyZWFkY3J1bWIgPiAuYWN0aXZlIHsgICAgIG9wYWNpdHk6IDAuODc7ICAgICBmb250LXNpemU6IDE0cHg7ICAgICBmb250LXdlaWdodDogNjAwOyAgICAgbGluZS1oZWlnaHQ6IDEuNDM7ICAgICBsZXR0ZXItc3BhY2luZzogLTAuMnB4OyAgICAgY29sb3I6ICMwMDAwMDA7IH1cIl1cbn0pXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRMaXN0QnJlYWRjcnVtYiB7XG5cbiAgICBwcml2YXRlIF9jdXJyZW50Rm9sZGVyUGF0aDogc3RyaW5nID0gJy8nO1xuXG4gICAgQElucHV0KClcbiAgICBzZXQgY3VycmVudEZvbGRlclBhdGgodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRGb2xkZXJQYXRoICE9PSB2YWwpIHtcbiAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50Rm9sZGVyUGF0aCA9IHZhbDtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlID0gdGhpcy5wYXJzZVBhdGgodmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudEZvbGRlclBhdGggPSB0aGlzLnJvb3RGb2xkZXIucGF0aDtcbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlID0gWyB0aGlzLnJvb3RGb2xkZXIgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGF0aENoYW5nZWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMuX2N1cnJlbnRGb2xkZXJQYXRoLFxuICAgICAgICAgICAgICAgIHJvdXRlOiB0aGlzLnJvdXRlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjdXJyZW50Rm9sZGVyUGF0aCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudEZvbGRlclBhdGg7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICB0YXJnZXQ6IERvY3VtZW50TGlzdDtcblxuICAgIHByaXZhdGUgcm9vdEZvbGRlcjogUGF0aE5vZGUgPSB7XG4gICAgICAgIG5hbWU6ICdSb290JyxcbiAgICAgICAgcGF0aDogJy8nXG4gICAgfTtcblxuICAgIHJvdXRlOiBQYXRoTm9kZVtdID0gWyB0aGlzLnJvb3RGb2xkZXIgXTtcblxuICAgIEBPdXRwdXQoKVxuICAgIG5hdmlnYXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKVxuICAgIHBhdGhDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIG9uUm91dGVQYXRoQ2xpY2socm91dGU6IFBhdGhOb2RlLCBlPzogRXZlbnQpIHtcbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyb3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZS5lbWl0KHtcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiByb3V0ZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiByb3V0ZS5wYXRoXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudEZvbGRlclBhdGggPSByb3V0ZS5wYXRoO1xuXG4gICAgICAgICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5jdXJyZW50Rm9sZGVyUGF0aCA9IHJvdXRlLnBhdGg7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQubG9hZEZvbGRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYXJzZVBhdGgocGF0aDogc3RyaW5nKTogUGF0aE5vZGVbXSB7XG4gICAgICAgIGxldCBwYXJ0cyA9IHBhdGguc3BsaXQoJy8nKS5maWx0ZXIodmFsID0+IHZhbCA/IHRydWUgOiBmYWxzZSk7XG5cbiAgICAgICAgbGV0IHJlc3VsdCA9IFtcbiAgICAgICAgICAgIHRoaXMucm9vdEZvbGRlclxuICAgICAgICBdO1xuXG4gICAgICAgIGxldCBwYXJlbnRQYXRoOiBzdHJpbmcgPSB0aGlzLnJvb3RGb2xkZXIucGF0aDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIXBhcmVudFBhdGguZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICAgICAgICAgIHBhcmVudFBhdGggKz0gJy8nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyZW50UGF0aCArPSBwYXJ0c1tpXTtcblxuICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6IHBhcnRzW2ldLFxuICAgICAgICAgICAgICAgIHBhdGg6IHBhcmVudFBhdGhcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBhdGhOb2RlIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgcGF0aDogc3RyaW5nO1xufVxuIl19
