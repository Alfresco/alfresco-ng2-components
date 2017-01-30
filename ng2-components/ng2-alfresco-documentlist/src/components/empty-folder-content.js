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
var document_list_1 = require("./document-list");
var EmptyFolderContent = (function () {
    function EmptyFolderContent(documentList) {
        this.documentList = documentList;
    }
    EmptyFolderContent.prototype.ngAfterContentInit = function () {
        this.documentList.emptyFolderTemplate = this.template;
        this.documentList.dataTable.noContentTemplate = this.template;
    };
    return EmptyFolderContent;
}());
__decorate([
    core_1.ContentChild(core_1.TemplateRef),
    __metadata("design:type", Object)
], EmptyFolderContent.prototype, "template", void 0);
EmptyFolderContent = __decorate([
    core_1.Directive({
        selector: 'empty-folder-content'
    }),
    __metadata("design:paramtypes", [document_list_1.DocumentList])
], EmptyFolderContent);
exports.EmptyFolderContent = EmptyFolderContent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZW1wdHktZm9sZGVyLWNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOzs7Ozs7Ozs7OztBQUVILHNDQUt1QjtBQUN2QixpREFBK0M7QUFLL0MsSUFBYSxrQkFBa0I7SUFLM0IsNEJBQW9CLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO0lBQzlDLENBQUM7SUFFRCwrQ0FBa0IsR0FBbEI7UUFDSSxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNsRSxDQUFDO0lBQ0wseUJBQUM7QUFBRCxDQVpBLEFBWUMsSUFBQTtBQVRHO0lBREMsbUJBQVksQ0FBQyxrQkFBVyxDQUFDOztvREFDWjtBQUhMLGtCQUFrQjtJQUg5QixnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLHNCQUFzQjtLQUNuQyxDQUFDO3FDQU1vQyw0QkFBWTtHQUxyQyxrQkFBa0IsQ0FZOUI7QUFaWSxnREFBa0IiLCJmaWxlIjoiY29tcG9uZW50cy9lbXB0eS1mb2xkZXItY29udGVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7XG4gICAgRGlyZWN0aXZlLFxuICAgIENvbnRlbnRDaGlsZCxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBBZnRlckNvbnRlbnRJbml0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9jdW1lbnRMaXN0IH0gZnJvbSAnLi9kb2N1bWVudC1saXN0JztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdlbXB0eS1mb2xkZXItY29udGVudCdcbn0pXG5leHBvcnQgY2xhc3MgRW1wdHlGb2xkZXJDb250ZW50IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG5cbiAgICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKVxuICAgIHRlbXBsYXRlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRvY3VtZW50TGlzdDogRG9jdW1lbnRMaXN0KSB7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLmRvY3VtZW50TGlzdC5lbXB0eUZvbGRlclRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICAgICAgdGhpcy5kb2N1bWVudExpc3QuZGF0YVRhYmxlLm5vQ29udGVudFRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICB9XG59XG4iXX0=
