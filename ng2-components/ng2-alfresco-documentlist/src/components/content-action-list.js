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
var ContentActionList = (function () {
    function ContentActionList(documentList) {
        this.documentList = documentList;
    }
    ContentActionList.prototype.registerAction = function (action) {
        if (this.documentList && action) {
            this.documentList.actions.push(action);
            return true;
        }
        return false;
    };
    return ContentActionList;
}());
ContentActionList = __decorate([
    core_1.Component({
        selector: 'content-actions',
        template: ''
    }),
    __metadata("design:paramtypes", [document_list_1.DocumentList])
], ContentActionList);
exports.ContentActionList = ContentActionList;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29udGVudC1hY3Rpb24tbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXdDO0FBQ3hDLGlEQUE2QztBQU83QyxJQUFhLGlCQUFpQjtJQUUxQiwyQkFDWSxZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztJQUN0QyxDQUFDO0lBTUQsMENBQWMsR0FBZCxVQUFlLE1BQTBCO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQWpCQSxBQWlCQyxJQUFBO0FBakJZLGlCQUFpQjtJQUo3QixnQkFBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLGlCQUFpQjtRQUMzQixRQUFRLEVBQUUsRUFBRTtLQUNmLENBQUM7cUNBSTRCLDRCQUFZO0dBSDdCLGlCQUFpQixDQWlCN0I7QUFqQlksOENBQWlCIiwiZmlsZSI6ImNvbXBvbmVudHMvY29udGVudC1hY3Rpb24tbGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RG9jdW1lbnRMaXN0fSBmcm9tICcuL2RvY3VtZW50LWxpc3QnO1xuaW1wb3J0IHtDb250ZW50QWN0aW9uTW9kZWx9IGZyb20gJy4vLi4vbW9kZWxzL2NvbnRlbnQtYWN0aW9uLm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdjb250ZW50LWFjdGlvbnMnLFxuICAgIHRlbXBsYXRlOiAnJ1xufSlcbmV4cG9ydCBjbGFzcyBDb250ZW50QWN0aW9uTGlzdCB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBkb2N1bWVudExpc3Q6IERvY3VtZW50TGlzdCkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhY3Rpb24gaGFuZGxlciB3aXRoaW4gdGhlIHBhcmVudCBkb2N1bWVudCBsaXN0IGNvbXBvbmVudC5cbiAgICAgKiBAcGFyYW0gYWN0aW9uIEFjdGlvbiBtb2RlbCB0byByZWdpc3Rlci5cbiAgICAgKi9cbiAgICByZWdpc3RlckFjdGlvbihhY3Rpb246IENvbnRlbnRBY3Rpb25Nb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudExpc3QgJiYgYWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50TGlzdC5hY3Rpb25zLnB1c2goYWN0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4iXX0=
