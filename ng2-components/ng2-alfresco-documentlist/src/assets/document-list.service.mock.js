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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require("rxjs/Observable");
var document_library_model_mock_1 = require("./document-library.model.mock");
var document_list_service_1 = require("./../services/document-list.service");
var DocumentListServiceMock = (function (_super) {
    __extends(DocumentListServiceMock, _super);
    function DocumentListServiceMock(settings, authService, contentService, apiService) {
        var _this = _super.call(this, authService, contentService, apiService) || this;
        _this.getFolderResult = new document_library_model_mock_1.PageNode();
        _this.getFolderReject = false;
        _this.getFolderRejectError = 'Error';
        return _this;
    }
    DocumentListServiceMock.prototype.getFolder = function (folder) {
        var _this = this;
        if (this.getFolderReject) {
            return Observable_1.Observable.throw(this.getFolderRejectError);
        }
        return Observable_1.Observable.create(function (observer) {
            observer.next(_this.getFolderResult);
            observer.complete();
        });
    };
    DocumentListServiceMock.prototype.deleteNode = function (nodeId) {
        return Observable_1.Observable.create(function (observer) {
            observer.next();
            observer.complete();
        });
    };
    return DocumentListServiceMock;
}(document_list_service_1.DocumentListService));
exports.DocumentListServiceMock = DocumentListServiceMock;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9kb2N1bWVudC1saXN0LnNlcnZpY2UubW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7QUFFSCw4Q0FBNkM7QUFFN0MsNkVBQXlEO0FBQ3pELDZFQUEwRTtBQVExRTtJQUE2QywyQ0FBbUI7SUFNNUQsaUNBQ0ksUUFBa0MsRUFDbEMsV0FBMkMsRUFDM0MsY0FBdUMsRUFDdkMsVUFBK0I7UUFKbkMsWUFNSSxrQkFBTSxXQUFXLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQyxTQUNqRDtRQVhELHFCQUFlLEdBQWUsSUFBSSxzQ0FBUSxFQUFFLENBQUM7UUFDN0MscUJBQWUsR0FBWSxLQUFLLENBQUM7UUFDakMsMEJBQW9CLEdBQVcsT0FBTyxDQUFDOztJQVN2QyxDQUFDO0lBRUQsMkNBQVMsR0FBVCxVQUFVLE1BQWM7UUFBeEIsaUJBUUM7UUFQRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUMsdUJBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUNELE1BQU0sQ0FBQyx1QkFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFBLFFBQVE7WUFDN0IsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDcEMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDRDQUFVLEdBQVYsVUFBVyxNQUFjO1FBQ3JCLE1BQU0sQ0FBQyx1QkFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFBLFFBQVE7WUFDN0IsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCw4QkFBQztBQUFELENBL0JBLEFBK0JDLENBL0I0QywyQ0FBbUIsR0ErQi9EO0FBL0JZLDBEQUF1QiIsImZpbGUiOiJhc3NldHMvZG9jdW1lbnQtbGlzdC5zZXJ2aWNlLm1vY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE5vZGVQYWdpbmcgfSBmcm9tICcuLy4uL21vZGVscy9kb2N1bWVudC1saWJyYXJ5Lm1vZGVsJztcbmltcG9ydCB7IFBhZ2VOb2RlIH0gZnJvbSAnLi9kb2N1bWVudC1saWJyYXJ5Lm1vZGVsLm1vY2snO1xuaW1wb3J0IHsgRG9jdW1lbnRMaXN0U2VydmljZSB9IGZyb20gJy4vLi4vc2VydmljZXMvZG9jdW1lbnQtbGlzdC5zZXJ2aWNlJztcbmltcG9ydCB7XG4gICAgQWxmcmVzY29TZXR0aW5nc1NlcnZpY2UsXG4gICAgQWxmcmVzY29BdXRoZW50aWNhdGlvblNlcnZpY2UsXG4gICAgQWxmcmVzY29Db250ZW50U2VydmljZSxcbiAgICBBbGZyZXNjb0FwaVNlcnZpY2Vcbn0gZnJvbSAnbmcyLWFsZnJlc2NvLWNvcmUnO1xuXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRMaXN0U2VydmljZU1vY2sgZXh0ZW5kcyBEb2N1bWVudExpc3RTZXJ2aWNlIHtcblxuICAgIGdldEZvbGRlclJlc3VsdDogTm9kZVBhZ2luZyA9IG5ldyBQYWdlTm9kZSgpO1xuICAgIGdldEZvbGRlclJlamVjdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGdldEZvbGRlclJlamVjdEVycm9yOiBzdHJpbmcgPSAnRXJyb3InO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHNldHRpbmdzPzogQWxmcmVzY29TZXR0aW5nc1NlcnZpY2UsXG4gICAgICAgIGF1dGhTZXJ2aWNlPzogQWxmcmVzY29BdXRoZW50aWNhdGlvblNlcnZpY2UsXG4gICAgICAgIGNvbnRlbnRTZXJ2aWNlPzogQWxmcmVzY29Db250ZW50U2VydmljZSxcbiAgICAgICAgYXBpU2VydmljZT86IEFsZnJlc2NvQXBpU2VydmljZVxuICAgICkge1xuICAgICAgICBzdXBlcihhdXRoU2VydmljZSwgY29udGVudFNlcnZpY2UsIGFwaVNlcnZpY2UpO1xuICAgIH1cblxuICAgIGdldEZvbGRlcihmb2xkZXI6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5nZXRGb2xkZXJSZWplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KHRoaXMuZ2V0Rm9sZGVyUmVqZWN0RXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShvYnNlcnZlciA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHRoaXMuZ2V0Rm9sZGVyUmVzdWx0KTtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlbGV0ZU5vZGUobm9kZUlkOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKG9ic2VydmVyID0+IHtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoKTtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
