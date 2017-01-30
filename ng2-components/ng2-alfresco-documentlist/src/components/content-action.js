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
var content_action_model_1 = require("./../models/content-action.model");
var content_action_list_1 = require("./content-action-list");
var document_actions_service_1 = require("../services/document-actions.service");
var folder_actions_service_1 = require("../services/folder-actions.service");
var ContentAction = (function () {
    function ContentAction(list, documentActions, folderActions) {
        this.list = list;
        this.documentActions = documentActions;
        this.folderActions = folderActions;
        this.title = 'Action';
        this.execute = new core_1.EventEmitter();
        this.model = new content_action_model_1.ContentActionModel();
    }
    ContentAction.prototype.ngOnInit = function () {
        var _this = this;
        this.model = new content_action_model_1.ContentActionModel({
            title: this.title,
            icon: this.icon,
            target: this.target
        });
        if (this.handler) {
            this.model.handler = this.getSystemHandler(this.target, this.handler);
        }
        else if (this.execute) {
            this.model.handler = function (document) {
                _this.execute.emit({
                    value: document
                });
            };
        }
        this.register();
    };
    ContentAction.prototype.register = function () {
        if (this.list) {
            return this.list.registerAction(this.model);
        }
        return false;
    };
    ContentAction.prototype.ngOnChanges = function (changes) {
        this.model.title = this.title;
    };
    ContentAction.prototype.getSystemHandler = function (target, name) {
        if (target) {
            var ltarget = target.toLowerCase();
            if (ltarget === 'document') {
                if (this.documentActions) {
                    return this.documentActions.getHandler(name);
                }
                return null;
            }
            if (ltarget === 'folder') {
                if (this.folderActions) {
                    return this.folderActions.getHandler(name);
                }
                return null;
            }
        }
        return null;
    };
    return ContentAction;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ContentAction.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ContentAction.prototype, "icon", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ContentAction.prototype, "handler", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ContentAction.prototype, "target", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ContentAction.prototype, "execute", void 0);
ContentAction = __decorate([
    core_1.Component({
        selector: 'content-action',
        template: ''
    }),
    __metadata("design:paramtypes", [content_action_list_1.ContentActionList,
        document_actions_service_1.DocumentActionsService,
        folder_actions_service_1.FolderActionsService])
], ContentAction);
exports.ContentAction = ContentAction;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29udGVudC1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOzs7Ozs7Ozs7OztBQUVILHNDQU91QjtBQUV2Qix5RUFBc0U7QUFDdEUsNkRBQTBEO0FBQzFELGlGQUE4RTtBQUM5RSw2RUFBMEU7QUFPMUUsSUFBYSxhQUFhO0lBbUJ0Qix1QkFDWSxJQUF1QixFQUN2QixlQUF1QyxFQUN2QyxhQUFtQztRQUZuQyxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUN2QixvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7UUFDdkMsa0JBQWEsR0FBYixhQUFhLENBQXNCO1FBbkIvQyxVQUFLLEdBQVcsUUFBUSxDQUFDO1FBWXpCLFlBQU8sR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQVF6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUkseUNBQWtCLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsZ0NBQVEsR0FBUjtRQUFBLGlCQWtCQztRQWpCRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUkseUNBQWtCLENBQUM7WUFDaEMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUN0QixDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxRSxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFVBQUMsUUFBYTtnQkFDL0IsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ2QsS0FBSyxFQUFFLFFBQVE7aUJBQ2xCLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQztRQUNOLENBQUM7UUFFRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELGdDQUFRLEdBQVI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELG1DQUFXLEdBQVgsVUFBWSxPQUFPO1FBRWYsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxDQUFDO0lBRUQsd0NBQWdCLEdBQWhCLFVBQWlCLE1BQWMsRUFBRSxJQUFZO1FBQ3pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFbkMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO29CQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pELENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0E5RUEsQUE4RUMsSUFBQTtBQTNFRztJQURDLFlBQUssRUFBRTs7NENBQ2lCO0FBR3pCO0lBREMsWUFBSyxFQUFFOzsyQ0FDSztBQUdiO0lBREMsWUFBSyxFQUFFOzs4Q0FDUTtBQUdoQjtJQURDLFlBQUssRUFBRTs7NkNBQ087QUFHZjtJQURDLGFBQU0sRUFBRTs7OENBQ29CO0FBZnBCLGFBQWE7SUFKekIsZ0JBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxnQkFBZ0I7UUFDMUIsUUFBUSxFQUFFLEVBQUU7S0FDZixDQUFDO3FDQXFCb0IsdUNBQWlCO1FBQ04saURBQXNCO1FBQ3hCLDZDQUFvQjtHQXRCdEMsYUFBYSxDQThFekI7QUE5RVksc0NBQWEiLCJmaWxlIjoiY29tcG9uZW50cy9jb250ZW50LWFjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7XG4gICAgQ29tcG9uZW50LFxuICAgIE9uSW5pdCxcbiAgICBPbkNoYW5nZXMsXG4gICAgSW5wdXQsXG4gICAgT3V0cHV0LFxuICAgIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ29udGVudEFjdGlvbk1vZGVsIH0gZnJvbSAnLi8uLi9tb2RlbHMvY29udGVudC1hY3Rpb24ubW9kZWwnO1xuaW1wb3J0IHsgQ29udGVudEFjdGlvbkxpc3QgfSBmcm9tICcuL2NvbnRlbnQtYWN0aW9uLWxpc3QnO1xuaW1wb3J0IHsgRG9jdW1lbnRBY3Rpb25zU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2RvY3VtZW50LWFjdGlvbnMuc2VydmljZSc7XG5pbXBvcnQgeyBGb2xkZXJBY3Rpb25zU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2ZvbGRlci1hY3Rpb25zLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29udGVudEFjdGlvbkhhbmRsZXIgfSBmcm9tICcuLi9tb2RlbHMvY29udGVudC1hY3Rpb24ubW9kZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2NvbnRlbnQtYWN0aW9uJyxcbiAgICB0ZW1wbGF0ZTogJydcbn0pXG5leHBvcnQgY2xhc3MgQ29udGVudEFjdGlvbiBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICAgIEBJbnB1dCgpXG4gICAgdGl0bGU6IHN0cmluZyA9ICdBY3Rpb24nO1xuXG4gICAgQElucHV0KClcbiAgICBpY29uOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKVxuICAgIGhhbmRsZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpXG4gICAgdGFyZ2V0OiBzdHJpbmc7XG5cbiAgICBAT3V0cHV0KClcbiAgICBleGVjdXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgbW9kZWw6IENvbnRlbnRBY3Rpb25Nb2RlbDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGxpc3Q6IENvbnRlbnRBY3Rpb25MaXN0LFxuICAgICAgICBwcml2YXRlIGRvY3VtZW50QWN0aW9uczogRG9jdW1lbnRBY3Rpb25zU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSBmb2xkZXJBY3Rpb25zOiBGb2xkZXJBY3Rpb25zU2VydmljZSkge1xuICAgICAgICB0aGlzLm1vZGVsID0gbmV3IENvbnRlbnRBY3Rpb25Nb2RlbCgpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLm1vZGVsID0gbmV3IENvbnRlbnRBY3Rpb25Nb2RlbCh7XG4gICAgICAgICAgICB0aXRsZTogdGhpcy50aXRsZSxcbiAgICAgICAgICAgIGljb246IHRoaXMuaWNvbixcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy50YXJnZXRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5oYW5kbGVyID0gdGhpcy5nZXRTeXN0ZW1IYW5kbGVyKHRoaXMudGFyZ2V0LCB0aGlzLmhhbmRsZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZXhlY3V0ZSkge1xuICAgICAgICAgICAgdGhpcy5tb2RlbC5oYW5kbGVyID0gKGRvY3VtZW50OiBhbnkpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4ZWN1dGUuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBkb2N1bWVudFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVnaXN0ZXIoKTtcbiAgICB9XG5cbiAgICByZWdpc3RlcigpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMubGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdC5yZWdpc3RlckFjdGlvbih0aGlzLm1vZGVsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xuICAgICAgICAvLyB1cGRhdGUgbG9jYWxpemFibGUgcHJvcGVydGllc1xuICAgICAgICB0aGlzLm1vZGVsLnRpdGxlID0gdGhpcy50aXRsZTtcbiAgICB9XG5cbiAgICBnZXRTeXN0ZW1IYW5kbGVyKHRhcmdldDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBDb250ZW50QWN0aW9uSGFuZGxlciB7XG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICAgIGxldCBsdGFyZ2V0ID0gdGFyZ2V0LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGlmIChsdGFyZ2V0ID09PSAnZG9jdW1lbnQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRBY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50QWN0aW9ucy5nZXRIYW5kbGVyKG5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGx0YXJnZXQgPT09ICdmb2xkZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9sZGVyQWN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mb2xkZXJBY3Rpb25zLmdldEhhbmRsZXIobmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbiJdfQ==
