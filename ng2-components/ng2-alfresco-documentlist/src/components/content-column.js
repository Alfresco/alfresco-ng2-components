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
var content_column_list_1 = require("./content-column-list");
var ContentColumn = (function () {
    function ContentColumn(list) {
        this.list = list;
        this.type = 'text';
        this.sortable = false;
        this.title = '';
    }
    ContentColumn.prototype.ngOnInit = function () {
        if (!this.srTitle && this.key === '$thumbnail') {
            this.srTitle = 'Thumbnail';
        }
        this.register();
    };
    ContentColumn.prototype.register = function () {
        if (this.list) {
            return this.list.registerColumn(this);
        }
        return false;
    };
    return ContentColumn;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ContentColumn.prototype, "key", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ContentColumn.prototype, "type", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ContentColumn.prototype, "format", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ContentColumn.prototype, "sortable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ContentColumn.prototype, "title", void 0);
__decorate([
    core_1.Input('sr-title'),
    __metadata("design:type", String)
], ContentColumn.prototype, "srTitle", void 0);
__decorate([
    core_1.Input('class'),
    __metadata("design:type", String)
], ContentColumn.prototype, "cssClass", void 0);
ContentColumn = __decorate([
    core_1.Component({
        selector: 'content-column',
        template: ''
    }),
    __metadata("design:paramtypes", [content_column_list_1.ContentColumnList])
], ContentColumn);
exports.ContentColumn = ContentColumn;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29udGVudC1jb2x1bW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOzs7Ozs7Ozs7OztBQUVILHNDQUF5RDtBQUN6RCw2REFBMEQ7QUFPMUQsSUFBYSxhQUFhO0lBMEJ0Qix1QkFBb0IsSUFBdUI7UUFBdkIsU0FBSSxHQUFKLElBQUksQ0FBbUI7UUFwQjNDLFNBQUksR0FBVyxNQUFNLENBQUM7UUFNdEIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUcxQixVQUFLLEdBQVcsRUFBRSxDQUFDO0lBVzJCLENBQUM7SUFFL0MsZ0NBQVEsR0FBUjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7UUFDL0IsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsZ0NBQVEsR0FBUjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTCxvQkFBQztBQUFELENBMUNBLEFBMENDLElBQUE7QUF2Q0c7SUFEQyxZQUFLLEVBQUU7OzBDQUNJO0FBR1o7SUFEQyxZQUFLLEVBQUU7OzJDQUNjO0FBR3RCO0lBREMsWUFBSyxFQUFFOzs2Q0FDTztBQUdmO0lBREMsWUFBSyxFQUFFOzsrQ0FDa0I7QUFHMUI7SUFEQyxZQUFLLEVBQUU7OzRDQUNXO0FBTW5CO0lBREMsWUFBSyxDQUFDLFVBQVUsQ0FBQzs7OENBQ0Y7QUFHaEI7SUFEQyxZQUFLLENBQUMsT0FBTyxDQUFDOzsrQ0FDRTtBQXhCUixhQUFhO0lBSnpCLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsZ0JBQWdCO1FBQzFCLFFBQVEsRUFBRSxFQUFFO0tBQ2YsQ0FBQztxQ0EyQjRCLHVDQUFpQjtHQTFCbEMsYUFBYSxDQTBDekI7QUExQ1ksc0NBQWEiLCJmaWxlIjoiY29tcG9uZW50cy9jb250ZW50LWNvbHVtbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udGVudENvbHVtbkxpc3QgfSBmcm9tICcuL2NvbnRlbnQtY29sdW1uLWxpc3QnO1xuaW1wb3J0IHsgRGF0YUNvbHVtbiB9IGZyb20gJ25nMi1hbGZyZXNjby1kYXRhdGFibGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2NvbnRlbnQtY29sdW1uJyxcbiAgICB0ZW1wbGF0ZTogJydcbn0pXG5leHBvcnQgY2xhc3MgQ29udGVudENvbHVtbiBpbXBsZW1lbnRzIE9uSW5pdCwgRGF0YUNvbHVtbiB7XG5cbiAgICBASW5wdXQoKVxuICAgIGtleTogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICB0eXBlOiBzdHJpbmcgPSAndGV4dCc7XG5cbiAgICBASW5wdXQoKVxuICAgIGZvcm1hdDogc3RyaW5nO1xuXG4gICAgQElucHV0KClcbiAgICBzb3J0YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KClcbiAgICB0aXRsZTogc3RyaW5nID0gJyc7XG5cbiAgICAvKipcbiAgICAgKiBUaXRsZSB0byBiZSB1c2VkIGZvciBzY3JlZW4gcmVhZGVycy5cbiAgICAgKi9cbiAgICBASW5wdXQoJ3NyLXRpdGxlJylcbiAgICBzclRpdGxlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoJ2NsYXNzJylcbiAgICBjc3NDbGFzczogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBsaXN0OiBDb250ZW50Q29sdW1uTGlzdCkge31cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBpZiAoIXRoaXMuc3JUaXRsZSAmJiB0aGlzLmtleSA9PT0gJyR0aHVtYm5haWwnKSB7XG4gICAgICAgICAgICB0aGlzLnNyVGl0bGUgPSAnVGh1bWJuYWlsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXIoKTtcbiAgICB9XG5cbiAgICByZWdpc3RlcigpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5yZWdpc3RlckNvbHVtbih0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuIl19
