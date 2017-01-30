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
var FolderActionsService = (function () {
    function FolderActionsService(documentListService) {
        this.documentListService = documentListService;
        this.handlers = {};
        this.setupActionHandlers();
    }
    FolderActionsService.prototype.getHandler = function (key) {
        if (key) {
            var lkey = key.toLowerCase();
            return this.handlers[lkey] || null;
        }
        return null;
    };
    FolderActionsService.prototype.setHandler = function (key, handler) {
        if (key) {
            var lkey = key.toLowerCase();
            this.handlers[lkey] = handler;
            return true;
        }
        return false;
    };
    FolderActionsService.prototype.canExecuteAction = function (obj) {
        return this.documentListService && obj && obj.entry.isFolder === true;
    };
    FolderActionsService.prototype.setupActionHandlers = function () {
        this.handlers['delete'] = this.deleteNode.bind(this);
        this.handlers['system1'] = this.handleStandardAction1.bind(this);
        this.handlers['system2'] = this.handleStandardAction2.bind(this);
    };
    FolderActionsService.prototype.handleStandardAction1 = function (document) {
        window.alert('standard folder action 1');
    };
    FolderActionsService.prototype.handleStandardAction2 = function (document) {
        window.alert('standard folder action 2');
    };
    FolderActionsService.prototype.deleteNode = function (obj, target) {
        if (this.canExecuteAction(obj) && obj.entry && obj.entry.id) {
            this.documentListService.deleteNode(obj.entry.id).subscribe(function () {
                if (target && typeof target.reload === 'function') {
                    target.reload();
                }
            });
        }
    };
    return FolderActionsService;
}());
FolderActionsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [document_list_service_1.DocumentListService])
], FolderActionsService);
exports.FolderActionsService = FolderActionsService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL2ZvbGRlci1hY3Rpb25zLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOzs7Ozs7Ozs7OztBQUVILHNDQUEyQztBQUUzQyxpRUFBOEQ7QUFHOUQsSUFBYSxvQkFBb0I7SUFHN0IsOEJBQW9CLG1CQUF5QztRQUF6Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXNCO1FBRnJELGFBQVEsR0FBNEMsRUFBRSxDQUFDO1FBRzNELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCx5Q0FBVSxHQUFWLFVBQVcsR0FBVztRQUNsQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztRQUN2QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQseUNBQVUsR0FBVixVQUFXLEdBQVcsRUFBRSxPQUE2QjtRQUNqRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELCtDQUFnQixHQUFoQixVQUFpQixHQUFRO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQztJQUMxRSxDQUFDO0lBRU8sa0RBQW1CLEdBQTNCO1FBQ0ksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUdyRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFHTyxvREFBcUIsR0FBN0IsVUFBOEIsUUFBYTtRQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUdPLG9EQUFxQixHQUE3QixVQUE4QixRQUFhO1FBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU8seUNBQVUsR0FBbEIsVUFBbUIsR0FBUSxFQUFFLE1BQVk7UUFDckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQ3hELEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNwQixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUNMLDJCQUFDO0FBQUQsQ0F2REEsQUF1REMsSUFBQTtBQXZEWSxvQkFBb0I7SUFEaEMsaUJBQVUsRUFBRTtxQ0FJaUMsMkNBQW1CO0dBSHBELG9CQUFvQixDQXVEaEM7QUF2RFksb0RBQW9CIiwiZmlsZSI6InNlcnZpY2VzL2ZvbGRlci1hY3Rpb25zLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250ZW50QWN0aW9uSGFuZGxlciB9IGZyb20gJy4uL21vZGVscy9jb250ZW50LWFjdGlvbi5tb2RlbCc7XG5pbXBvcnQgeyBEb2N1bWVudExpc3RTZXJ2aWNlIH0gZnJvbSAnLi9kb2N1bWVudC1saXN0LnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRm9sZGVyQWN0aW9uc1NlcnZpY2Uge1xuICAgIHByaXZhdGUgaGFuZGxlcnM6IHsgW2lkOiBzdHJpbmddOiBDb250ZW50QWN0aW9uSGFuZGxlcjsgfSA9IHt9O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBkb2N1bWVudExpc3RTZXJ2aWNlPzogRG9jdW1lbnRMaXN0U2VydmljZSkge1xuICAgICAgICB0aGlzLnNldHVwQWN0aW9uSGFuZGxlcnMoKTtcbiAgICB9XG5cbiAgICBnZXRIYW5kbGVyKGtleTogc3RyaW5nKTogQ29udGVudEFjdGlvbkhhbmRsZXIge1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBsZXQgbGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlcnNbbGtleV0gfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzZXRIYW5kbGVyKGtleTogc3RyaW5nLCBoYW5kbGVyOiBDb250ZW50QWN0aW9uSGFuZGxlcik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBsZXQgbGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVyc1tsa2V5XSA9IGhhbmRsZXI7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY2FuRXhlY3V0ZUFjdGlvbihvYmo6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kb2N1bWVudExpc3RTZXJ2aWNlICYmIG9iaiAmJiBvYmouZW50cnkuaXNGb2xkZXIgPT09IHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cEFjdGlvbkhhbmRsZXJzKCkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzWydkZWxldGUnXSA9IHRoaXMuZGVsZXRlTm9kZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIC8vIFRPRE86IGZvciBkZW1vIHB1cnBvc2VzIG9ubHksIHdpbGwgYmUgcmVtb3ZlZCBkdXJpbmcgZnV0dXJlIHJldmlzaW9uc1xuICAgICAgICB0aGlzLmhhbmRsZXJzWydzeXN0ZW0xJ10gPSB0aGlzLmhhbmRsZVN0YW5kYXJkQWN0aW9uMS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZXJzWydzeXN0ZW0yJ10gPSB0aGlzLmhhbmRsZVN0YW5kYXJkQWN0aW9uMi5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGZvciBkZW1vIHB1cnBvc2VzIG9ubHksIHdpbGwgYmUgcmVtb3ZlZCBkdXJpbmcgZnV0dXJlIHJldmlzaW9uc1xuICAgIHByaXZhdGUgaGFuZGxlU3RhbmRhcmRBY3Rpb24xKGRvY3VtZW50OiBhbnkpIHtcbiAgICAgICAgd2luZG93LmFsZXJ0KCdzdGFuZGFyZCBmb2xkZXIgYWN0aW9uIDEnKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBmb3IgZGVtbyBwdXJwb3NlcyBvbmx5LCB3aWxsIGJlIHJlbW92ZWQgZHVyaW5nIGZ1dHVyZSByZXZpc2lvbnNcbiAgICBwcml2YXRlIGhhbmRsZVN0YW5kYXJkQWN0aW9uMihkb2N1bWVudDogYW55KSB7XG4gICAgICAgIHdpbmRvdy5hbGVydCgnc3RhbmRhcmQgZm9sZGVyIGFjdGlvbiAyJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkZWxldGVOb2RlKG9iajogYW55LCB0YXJnZXQ/OiBhbnkpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuRXhlY3V0ZUFjdGlvbihvYmopICYmIG9iai5lbnRyeSAmJiBvYmouZW50cnkuaWQpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRMaXN0U2VydmljZS5kZWxldGVOb2RlKG9iai5lbnRyeS5pZCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQucmVsb2FkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
