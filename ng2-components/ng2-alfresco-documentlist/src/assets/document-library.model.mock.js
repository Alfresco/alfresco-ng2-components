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
var document_library_model_1 = require("../models/document-library.model");
var PageNode = (function (_super) {
    __extends(PageNode, _super);
    function PageNode(entries) {
        var _this = _super.call(this) || this;
        _this.list = new document_library_model_1.NodePagingList();
        _this.list.entries = entries || [];
        return _this;
    }
    return PageNode;
}(document_library_model_1.NodePaging));
exports.PageNode = PageNode;
var FileNode = (function (_super) {
    __extends(FileNode, _super);
    function FileNode(name, mimeType) {
        var _this = _super.call(this) || this;
        _this.entry = new document_library_model_1.NodeMinimal();
        _this.entry.id = 'file-id';
        _this.entry.isFile = true;
        _this.entry.isFolder = false;
        _this.entry.name = name;
        _this.entry.path = new document_library_model_1.PathInfoEntity();
        _this.entry.content = new document_library_model_1.ContentInfo();
        _this.entry.content.mimeType = mimeType || 'text/plain';
        return _this;
    }
    return FileNode;
}(document_library_model_1.NodeMinimalEntry));
exports.FileNode = FileNode;
var FolderNode = (function (_super) {
    __extends(FolderNode, _super);
    function FolderNode(name) {
        var _this = _super.call(this) || this;
        _this.entry = new document_library_model_1.NodeMinimal();
        _this.entry.id = 'folder-id';
        _this.entry.isFile = false;
        _this.entry.isFolder = true;
        _this.entry.name = name;
        _this.entry.path = new document_library_model_1.PathInfoEntity();
        return _this;
    }
    return FolderNode;
}(document_library_model_1.NodeMinimalEntry));
exports.FolderNode = FolderNode;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9kb2N1bWVudC1saWJyYXJ5Lm1vZGVsLm1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOzs7Ozs7O0FBRUgsMkVBTzBDO0FBRTFDO0lBQThCLDRCQUFVO0lBQ3BDLGtCQUFZLE9BQTRCO1FBQXhDLFlBQ0ksaUJBQU8sU0FHVjtRQUZHLEtBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSx1Q0FBYyxFQUFFLENBQUM7UUFDakMsS0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQzs7SUFDdEMsQ0FBQztJQUNMLGVBQUM7QUFBRCxDQU5BLEFBTUMsQ0FONkIsbUNBQVUsR0FNdkM7QUFOWSw0QkFBUTtBQVFyQjtJQUE4Qiw0QkFBZ0I7SUFDMUMsa0JBQVksSUFBYSxFQUFFLFFBQWlCO1FBQTVDLFlBQ0ksaUJBQU8sU0FTVjtRQVJHLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxvQ0FBVyxFQUFFLENBQUM7UUFDL0IsS0FBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQzFCLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN6QixLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDNUIsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksdUNBQWMsRUFBRSxDQUFDO1FBQ3ZDLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksb0NBQVcsRUFBRSxDQUFDO1FBQ3ZDLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksWUFBWSxDQUFDOztJQUMzRCxDQUFDO0lBQ0wsZUFBQztBQUFELENBWkEsQUFZQyxDQVo2Qix5Q0FBZ0IsR0FZN0M7QUFaWSw0QkFBUTtBQWNyQjtJQUFnQyw4QkFBZ0I7SUFDNUMsb0JBQVksSUFBYTtRQUF6QixZQUNJLGlCQUFPLFNBT1Y7UUFORyxLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksb0NBQVcsRUFBRSxDQUFDO1FBQy9CLEtBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLFdBQVcsQ0FBQztRQUM1QixLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDMUIsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQzNCLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN2QixLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLHVDQUFjLEVBQUUsQ0FBQzs7SUFDM0MsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FWQSxBQVVDLENBVitCLHlDQUFnQixHQVUvQztBQVZZLGdDQUFVIiwiZmlsZSI6ImFzc2V0cy9kb2N1bWVudC1saWJyYXJ5Lm1vZGVsLm1vY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICAgIE5vZGVQYWdpbmcsXG4gICAgTm9kZU1pbmltYWxFbnRyeSxcbiAgICBOb2RlTWluaW1hbCxcbiAgICBQYXRoSW5mb0VudGl0eSxcbiAgICBDb250ZW50SW5mbyxcbiAgICBOb2RlUGFnaW5nTGlzdFxufSBmcm9tICcuLi9tb2RlbHMvZG9jdW1lbnQtbGlicmFyeS5tb2RlbCc7XG5cbmV4cG9ydCBjbGFzcyBQYWdlTm9kZSBleHRlbmRzIE5vZGVQYWdpbmcge1xuICAgIGNvbnN0cnVjdG9yKGVudHJpZXM/OiBOb2RlTWluaW1hbEVudHJ5W10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5saXN0ID0gbmV3IE5vZGVQYWdpbmdMaXN0KCk7XG4gICAgICAgIHRoaXMubGlzdC5lbnRyaWVzID0gZW50cmllcyB8fCBbXTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGaWxlTm9kZSBleHRlbmRzIE5vZGVNaW5pbWFsRW50cnkge1xuICAgIGNvbnN0cnVjdG9yKG5hbWU/OiBzdHJpbmcsIG1pbWVUeXBlPzogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50cnkgPSBuZXcgTm9kZU1pbmltYWwoKTtcbiAgICAgICAgdGhpcy5lbnRyeS5pZCA9ICdmaWxlLWlkJztcbiAgICAgICAgdGhpcy5lbnRyeS5pc0ZpbGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmVudHJ5LmlzRm9sZGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZW50cnkubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuZW50cnkucGF0aCA9IG5ldyBQYXRoSW5mb0VudGl0eSgpO1xuICAgICAgICB0aGlzLmVudHJ5LmNvbnRlbnQgPSBuZXcgQ29udGVudEluZm8oKTtcbiAgICAgICAgdGhpcy5lbnRyeS5jb250ZW50Lm1pbWVUeXBlID0gbWltZVR5cGUgfHwgJ3RleHQvcGxhaW4nO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZvbGRlck5vZGUgZXh0ZW5kcyBOb2RlTWluaW1hbEVudHJ5IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lPzogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZW50cnkgPSBuZXcgTm9kZU1pbmltYWwoKTtcbiAgICAgICAgdGhpcy5lbnRyeS5pZCA9ICdmb2xkZXItaWQnO1xuICAgICAgICB0aGlzLmVudHJ5LmlzRmlsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVudHJ5LmlzRm9sZGVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lbnRyeS5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5lbnRyeS5wYXRoID0gbmV3IFBhdGhJbmZvRW50aXR5KCk7XG4gICAgfVxufVxuIl19
