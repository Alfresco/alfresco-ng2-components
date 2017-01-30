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
var document_list_service_1 = require("./document-list.service");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var DocumentActionsService = (function () {
    function DocumentActionsService(documentListService, contentService) {
        this.documentListService = documentListService;
        this.contentService = contentService;
        this.handlers = {};
        this.setupActionHandlers();
    }
    DocumentActionsService.prototype.getHandler = function (key) {
        if (key) {
            var lkey = key.toLowerCase();
            return this.handlers[lkey] || null;
        }
        return null;
    };
    DocumentActionsService.prototype.setHandler = function (key, handler) {
        if (key) {
            var lkey = key.toLowerCase();
            this.handlers[lkey] = handler;
            return true;
        }
        return false;
    };
    DocumentActionsService.prototype.canExecuteAction = function (obj) {
        return this.documentListService && obj && obj.entry.isFile === true;
    };
    DocumentActionsService.prototype.setupActionHandlers = function () {
        this.handlers['download'] = this.download.bind(this);
        this.handlers['delete'] = this.deleteNode.bind(this);
        this.handlers['system1'] = this.handleStandardAction1.bind(this);
        this.handlers['system2'] = this.handleStandardAction2.bind(this);
    };
    DocumentActionsService.prototype.handleStandardAction1 = function (obj) {
        window.alert('standard document action 1');
    };
    DocumentActionsService.prototype.handleStandardAction2 = function (obj) {
        window.alert('standard document action 2');
    };
    DocumentActionsService.prototype.download = function (obj) {
        if (this.canExecuteAction(obj) && this.contentService) {
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.setAttribute('download', 'download');
            link.href = this.contentService.getContentUrl(obj);
            link.click();
            document.body.removeChild(link);
            return true;
        }
        return false;
    };
    DocumentActionsService.prototype.deleteNode = function (obj, target) {
        if (this.canExecuteAction(obj) && obj.entry && obj.entry.id) {
            this.documentListService.deleteNode(obj.entry.id).subscribe(function () {
                if (target && typeof target.reload === 'function') {
                    target.reload();
                }
            });
        }
    };
    return DocumentActionsService;
}());
DocumentActionsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [document_list_service_1.DocumentListService,
        ng2_alfresco_core_1.AlfrescoContentService])
], DocumentActionsService);
exports.DocumentActionsService = DocumentActionsService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL2RvY3VtZW50LWFjdGlvbnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTJDO0FBRTNDLGlFQUE4RDtBQUM5RCx1REFBMkQ7QUFHM0QsSUFBYSxzQkFBc0I7SUFHL0IsZ0NBQ1ksbUJBQXlDLEVBQ3pDLGNBQXVDO1FBRHZDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBc0I7UUFDekMsbUJBQWMsR0FBZCxjQUFjLENBQXlCO1FBSjNDLGFBQVEsR0FBNEMsRUFBRSxDQUFDO1FBTTNELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCwyQ0FBVSxHQUFWLFVBQVcsR0FBVztRQUNsQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztRQUN2QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsMkNBQVUsR0FBVixVQUFXLEdBQVcsRUFBRSxPQUE2QjtRQUNqRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELGlEQUFnQixHQUFoQixVQUFpQixHQUFRO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQztJQUN4RSxDQUFDO0lBRU8sb0RBQW1CLEdBQTNCO1FBQ0ksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBR3JELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUdPLHNEQUFxQixHQUE3QixVQUE4QixHQUFRO1FBQ2xDLE1BQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBR08sc0RBQXFCLEdBQTdCLFVBQThCLEdBQVE7UUFDbEMsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTyx5Q0FBUSxHQUFoQixVQUFpQixHQUFRO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sMkNBQVUsR0FBbEIsVUFBbUIsR0FBUSxFQUFFLE1BQVk7UUFDckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ3hELEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNwQixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUNMLDZCQUFDO0FBQUQsQ0F4RUEsQUF3RUMsSUFBQTtBQXhFWSxzQkFBc0I7SUFEbEMsaUJBQVUsRUFBRTtxQ0FLeUIsMkNBQW1CO1FBQ3hCLDBDQUFzQjtHQUwxQyxzQkFBc0IsQ0F3RWxDO0FBeEVZLHdEQUFzQiIsImZpbGUiOiJzZXJ2aWNlcy9kb2N1bWVudC1hY3Rpb25zLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250ZW50QWN0aW9uSGFuZGxlciB9IGZyb20gJy4uL21vZGVscy9jb250ZW50LWFjdGlvbi5tb2RlbCc7XG5pbXBvcnQgeyBEb2N1bWVudExpc3RTZXJ2aWNlIH0gZnJvbSAnLi9kb2N1bWVudC1saXN0LnNlcnZpY2UnO1xuaW1wb3J0IHsgQWxmcmVzY29Db250ZW50U2VydmljZSB9IGZyb20gJ25nMi1hbGZyZXNjby1jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERvY3VtZW50QWN0aW9uc1NlcnZpY2Uge1xuICAgIHByaXZhdGUgaGFuZGxlcnM6IHsgW2lkOiBzdHJpbmddOiBDb250ZW50QWN0aW9uSGFuZGxlcjsgfSA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgZG9jdW1lbnRMaXN0U2VydmljZT86IERvY3VtZW50TGlzdFNlcnZpY2UsXG4gICAgICAgIHByaXZhdGUgY29udGVudFNlcnZpY2U/OiBBbGZyZXNjb0NvbnRlbnRTZXJ2aWNlXG4gICAgKSB7XG4gICAgICAgIHRoaXMuc2V0dXBBY3Rpb25IYW5kbGVycygpO1xuICAgIH1cblxuICAgIGdldEhhbmRsZXIoa2V5OiBzdHJpbmcpOiBDb250ZW50QWN0aW9uSGFuZGxlciB7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGxldCBsa2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVyc1tsa2V5XSB8fCBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHNldEhhbmRsZXIoa2V5OiBzdHJpbmcsIGhhbmRsZXI6IENvbnRlbnRBY3Rpb25IYW5kbGVyKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGxldCBsa2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZXJzW2xrZXldID0gaGFuZGxlcjtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjYW5FeGVjdXRlQWN0aW9uKG9iajogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50TGlzdFNlcnZpY2UgJiYgb2JqICYmIG9iai5lbnRyeS5pc0ZpbGUgPT09IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cEFjdGlvbkhhbmRsZXJzKCkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzWydkb3dubG9hZCddID0gdGhpcy5kb3dubG9hZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZXJzWydkZWxldGUnXSA9IHRoaXMuZGVsZXRlTm9kZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIC8vIFRPRE86IGZvciBkZW1vIHB1cnBvc2VzIG9ubHksIHdpbGwgYmUgcmVtb3ZlZCBkdXJpbmcgZnV0dXJlIHJldmlzaW9uc1xuICAgICAgICB0aGlzLmhhbmRsZXJzWydzeXN0ZW0xJ10gPSB0aGlzLmhhbmRsZVN0YW5kYXJkQWN0aW9uMS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZXJzWydzeXN0ZW0yJ10gPSB0aGlzLmhhbmRsZVN0YW5kYXJkQWN0aW9uMi5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGZvciBkZW1vIHB1cnBvc2VzIG9ubHksIHdpbGwgYmUgcmVtb3ZlZCBkdXJpbmcgZnV0dXJlIHJldmlzaW9uc1xuICAgIHByaXZhdGUgaGFuZGxlU3RhbmRhcmRBY3Rpb24xKG9iajogYW55KSB7XG4gICAgICAgIHdpbmRvdy5hbGVydCgnc3RhbmRhcmQgZG9jdW1lbnQgYWN0aW9uIDEnKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBmb3IgZGVtbyBwdXJwb3NlcyBvbmx5LCB3aWxsIGJlIHJlbW92ZWQgZHVyaW5nIGZ1dHVyZSByZXZpc2lvbnNcbiAgICBwcml2YXRlIGhhbmRsZVN0YW5kYXJkQWN0aW9uMihvYmo6IGFueSkge1xuICAgICAgICB3aW5kb3cuYWxlcnQoJ3N0YW5kYXJkIGRvY3VtZW50IGFjdGlvbiAyJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb3dubG9hZChvYmo6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5jYW5FeGVjdXRlQWN0aW9uKG9iaikgJiYgdGhpcy5jb250ZW50U2VydmljZSkge1xuICAgICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgJ2Rvd25sb2FkJyk7XG4gICAgICAgICAgICBsaW5rLmhyZWYgPSB0aGlzLmNvbnRlbnRTZXJ2aWNlLmdldENvbnRlbnRVcmwob2JqKTtcbiAgICAgICAgICAgIGxpbmsuY2xpY2soKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWxldGVOb2RlKG9iajogYW55LCB0YXJnZXQ/OiBhbnkpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuRXhlY3V0ZUFjdGlvbihvYmopICYmIG9iai5lbnRyeSAmJiBvYmouZW50cnkuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRMaXN0U2VydmljZS5kZWxldGVOb2RlKG9iai5lbnRyeS5pZCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQucmVsb2FkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
