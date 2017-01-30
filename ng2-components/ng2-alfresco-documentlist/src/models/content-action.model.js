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
var ContentActionModel = (function () {
    function ContentActionModel(obj) {
        if (obj) {
            this.icon = obj.icon;
            this.title = obj.title;
            this.handler = obj.handler;
            this.target = obj.target;
        }
    }
    return ContentActionModel;
}());
exports.ContentActionModel = ContentActionModel;
var DocumentActionModel = (function (_super) {
    __extends(DocumentActionModel, _super);
    function DocumentActionModel(json) {
        var _this = _super.call(this, json) || this;
        _this.target = 'document';
        return _this;
    }
    return DocumentActionModel;
}(ContentActionModel));
exports.DocumentActionModel = DocumentActionModel;
var FolderActionModel = (function (_super) {
    __extends(FolderActionModel, _super);
    function FolderActionModel(json) {
        var _this = _super.call(this, json) || this;
        _this.target = 'folder';
        return _this;
    }
    return FolderActionModel;
}(ContentActionModel));
exports.FolderActionModel = FolderActionModel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVscy9jb250ZW50LWFjdGlvbi5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7Ozs7Ozs7QUFFSDtJQU1JLDRCQUFZLEdBQVM7UUFDakIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUM3QixDQUFDO0lBQ0wsQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FkQSxBQWNDLElBQUE7QUFkWSxnREFBa0I7QUFvQi9CO0lBQXlDLHVDQUFrQjtJQUN2RCw2QkFBWSxJQUFVO1FBQXRCLFlBQ0ksa0JBQU0sSUFBSSxDQUFDLFNBRWQ7UUFERyxLQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQzs7SUFDN0IsQ0FBQztJQUNMLDBCQUFDO0FBQUQsQ0FMQSxBQUtDLENBTHdDLGtCQUFrQixHQUsxRDtBQUxZLGtEQUFtQjtBQU9oQztJQUF3QyxxQ0FBa0I7SUFDdEQsMkJBQVksSUFBVTtRQUF0QixZQUNJLGtCQUFNLElBQUksQ0FBQyxTQUVkO1FBREcsS0FBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7O0lBQzNCLENBQUM7SUFDTCx3QkFBQztBQUFELENBTEEsQUFLQyxDQUx1QyxrQkFBa0IsR0FLekQ7QUFMWSw4Q0FBaUIiLCJmaWxlIjoibW9kZWxzL2NvbnRlbnQtYWN0aW9uLm1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGNsYXNzIENvbnRlbnRBY3Rpb25Nb2RlbCB7XG4gICAgaWNvbjogc3RyaW5nO1xuICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgaGFuZGxlcjogQ29udGVudEFjdGlvbkhhbmRsZXI7XG4gICAgdGFyZ2V0OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo/OiBhbnkpIHtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGhpcy5pY29uID0gb2JqLmljb247XG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gb2JqLnRpdGxlO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVyID0gb2JqLmhhbmRsZXI7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IG9iai50YXJnZXQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGVudEFjdGlvbkhhbmRsZXIge1xuICAgIChvYmo6IGFueSwgdGFyZ2V0PzogYW55KTogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRBY3Rpb25Nb2RlbCBleHRlbmRzIENvbnRlbnRBY3Rpb25Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoanNvbj86IGFueSkgIHtcbiAgICAgICAgc3VwZXIoanNvbik7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJ2RvY3VtZW50JztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb2xkZXJBY3Rpb25Nb2RlbCBleHRlbmRzICBDb250ZW50QWN0aW9uTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGpzb24/OiBhbnkpICB7XG4gICAgICAgIHN1cGVyKGpzb24pO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICdmb2xkZXInO1xuICAgIH1cbn1cbiJdfQ==
