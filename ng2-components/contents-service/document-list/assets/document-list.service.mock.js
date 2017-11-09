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
'use strict';
var __extends = this && this.__extends || function () {
  var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
Object.defineProperty(exports, '__esModule', { value: true });
var Rx_1 = require('rxjs/Rx');
var document_library_model_mock_1 = require('./document-library.model.mock');
var document_list_service_1 = require('./../services/document-list.service');
var DocumentListServiceMock = function (_super) {
  __extends(DocumentListServiceMock, _super);
  function DocumentListServiceMock(settings, authService, contentService, apiService, logService) {
    var _this = _super.call(this, authService, contentService, apiService, logService) || this;
    _this.getFolderResult = new document_library_model_mock_1.PageNode();
    _this.getFolderReject = false;
    _this.getFolderRejectError = 'Error';
    return _this;
  }
  DocumentListServiceMock.prototype.getFolder = function (folder) {
    var _this = this;
    if (this.getFolderReject) {
      return Rx_1.Observable.throw(this.getFolderRejectError);
    }
    return Rx_1.Observable.create(function (observer) {
      observer.next(_this.getFolderResult);
      observer.complete();
    });
  };
  DocumentListServiceMock.prototype.deleteNode = function (nodeId) {
    return Rx_1.Observable.create(function (observer) {
      observer.next();
      observer.complete();
    });
  };
  return DocumentListServiceMock;
}(document_list_service_1.DocumentListService);
exports.DocumentListServiceMock = DocumentListServiceMock;  //# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9kb2N1bWVudC1saXN0LnNlcnZpY2UubW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7Ozs7Ozs7QUFFSCw4QkFBcUM7QUFFckMsNkVBQXlEO0FBQ3pELDZFQUEwRTtBQVMxRTtJQUE2QywyQ0FBbUI7SUFNNUQsaUNBQ0ksUUFBa0MsRUFDbEMsV0FBMkMsRUFDM0MsY0FBdUMsRUFDdkMsVUFBK0IsRUFDL0IsVUFBdUI7UUFMM0IsWUFPSSxrQkFBTSxXQUFXLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsU0FDN0Q7UUFaRCxxQkFBZSxHQUFlLElBQUksc0NBQVEsRUFBRSxDQUFDO1FBQzdDLHFCQUFlLEdBQVksS0FBSyxDQUFDO1FBQ2pDLDBCQUFvQixHQUFXLE9BQU8sQ0FBQzs7SUFVdkMsQ0FBQztJQUVELDJDQUFTLEdBQVQsVUFBVSxNQUFjO1FBQXhCLGlCQVFDO1FBUEcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLGVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUNELE1BQU0sQ0FBQyxlQUFVLENBQUMsTUFBTSxDQUFDLFVBQUEsUUFBUTtZQUM3QixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNwQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsNENBQVUsR0FBVixVQUFXLE1BQWM7UUFDckIsTUFBTSxDQUFDLGVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQSxRQUFRO1lBQzdCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQWhDQSxBQWdDQyxDQWhDNEMsMkNBQW1CLEdBZ0MvRDtBQWhDWSwwREFBdUIiLCJmaWxlIjoiYXNzZXRzL2RvY3VtZW50LWxpc3Quc2VydmljZS5tb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMvUngnO1xuaW1wb3J0IHsgTm9kZVBhZ2luZyB9IGZyb20gJy4vLi4vbW9kZWxzL2RvY3VtZW50LWxpYnJhcnkubW9kZWwnO1xuaW1wb3J0IHsgUGFnZU5vZGUgfSBmcm9tICcuL2RvY3VtZW50LWxpYnJhcnkubW9kZWwubW9jayc7XG5pbXBvcnQgeyBEb2N1bWVudExpc3RTZXJ2aWNlIH0gZnJvbSAnLi8uLi9zZXJ2aWNlcy9kb2N1bWVudC1saXN0LnNlcnZpY2UnO1xuaW1wb3J0IHtcbiAgICBBbGZyZXNjb1NldHRpbmdzU2VydmljZSxcbiAgICBBbGZyZXNjb0F1dGhlbnRpY2F0aW9uU2VydmljZSxcbiAgICBBbGZyZXNjb0NvbnRlbnRTZXJ2aWNlLFxuICAgIEFsZnJlc2NvQXBpU2VydmljZSxcbiAgICBMb2dTZXJ2aWNlXG59IGZyb20gJ25nMi1hbGZyZXNjby1jb3JlJztcblxuZXhwb3J0IGNsYXNzIERvY3VtZW50TGlzdFNlcnZpY2VNb2NrIGV4dGVuZHMgRG9jdW1lbnRMaXN0U2VydmljZSB7XG5cbiAgICBnZXRGb2xkZXJSZXN1bHQ6IE5vZGVQYWdpbmcgPSBuZXcgUGFnZU5vZGUoKTtcbiAgICBnZXRGb2xkZXJSZWplY3Q6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBnZXRGb2xkZXJSZWplY3RFcnJvcjogc3RyaW5nID0gJ0Vycm9yJztcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBzZXR0aW5ncz86IEFsZnJlc2NvU2V0dGluZ3NTZXJ2aWNlLFxuICAgICAgICBhdXRoU2VydmljZT86IEFsZnJlc2NvQXV0aGVudGljYXRpb25TZXJ2aWNlLFxuICAgICAgICBjb250ZW50U2VydmljZT86IEFsZnJlc2NvQ29udGVudFNlcnZpY2UsXG4gICAgICAgIGFwaVNlcnZpY2U/OiBBbGZyZXNjb0FwaVNlcnZpY2UsXG4gICAgICAgIGxvZ1NlcnZpY2U/OiBMb2dTZXJ2aWNlLFxuICAgICkge1xuICAgICAgICBzdXBlcihhdXRoU2VydmljZSwgY29udGVudFNlcnZpY2UsIGFwaVNlcnZpY2UsIGxvZ1NlcnZpY2UpO1xuICAgIH1cblxuICAgIGdldEZvbGRlcihmb2xkZXI6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5nZXRGb2xkZXJSZWplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KHRoaXMuZ2V0Rm9sZGVyUmVqZWN0RXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmNyZWF0ZShvYnNlcnZlciA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHRoaXMuZ2V0Rm9sZGVyUmVzdWx0KTtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlbGV0ZU5vZGUobm9kZUlkOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuY3JlYXRlKG9ic2VydmVyID0+IHtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoKTtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==
