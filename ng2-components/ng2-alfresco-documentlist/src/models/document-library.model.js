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
var NodePaging = (function () {
    function NodePaging() {
    }
    return NodePaging;
}());
exports.NodePaging = NodePaging;
var NodePagingList = (function () {
    function NodePagingList() {
    }
    return NodePagingList;
}());
exports.NodePagingList = NodePagingList;
var NodeMinimalEntry = (function () {
    function NodeMinimalEntry() {
    }
    return NodeMinimalEntry;
}());
exports.NodeMinimalEntry = NodeMinimalEntry;
var Pagination = (function () {
    function Pagination() {
    }
    return Pagination;
}());
exports.Pagination = Pagination;
var NodeMinimal = (function () {
    function NodeMinimal() {
        this.properties = {};
    }
    return NodeMinimal;
}());
exports.NodeMinimal = NodeMinimal;
var UserInfo = (function () {
    function UserInfo() {
    }
    return UserInfo;
}());
exports.UserInfo = UserInfo;
var ContentInfo = (function () {
    function ContentInfo() {
    }
    return ContentInfo;
}());
exports.ContentInfo = ContentInfo;
var PathInfoEntity = (function () {
    function PathInfoEntity() {
    }
    return PathInfoEntity;
}());
exports.PathInfoEntity = PathInfoEntity;
var PathElementEntity = (function () {
    function PathElementEntity() {
    }
    return PathElementEntity;
}());
exports.PathElementEntity = PathElementEntity;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVscy9kb2N1bWVudC1saWJyYXJ5Lm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7QUFNSDtJQUFBO0lBRUEsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FGQSxBQUVDLElBQUE7QUFGWSxnQ0FBVTtBQUl2QjtJQUFBO0lBR0EsQ0FBQztJQUFELHFCQUFDO0FBQUQsQ0FIQSxBQUdDLElBQUE7QUFIWSx3Q0FBYztBQUszQjtJQUFBO0lBRUEsQ0FBQztJQUFELHVCQUFDO0FBQUQsQ0FGQSxBQUVDLElBQUE7QUFGWSw0Q0FBZ0I7QUFJN0I7SUFBQTtJQU1BLENBQUM7SUFBRCxpQkFBQztBQUFELENBTkEsQUFNQyxJQUFBO0FBTlksZ0NBQVU7QUFRdkI7SUFBQTtRQWFJLGVBQVUsR0FBbUIsRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFBRCxrQkFBQztBQUFELENBZEEsQUFjQyxJQUFBO0FBZFksa0NBQVc7QUFnQnhCO0lBQUE7SUFHQSxDQUFDO0lBQUQsZUFBQztBQUFELENBSEEsQUFHQyxJQUFBO0FBSFksNEJBQVE7QUFLckI7SUFBQTtJQUtBLENBQUM7SUFBRCxrQkFBQztBQUFELENBTEEsQUFLQyxJQUFBO0FBTFksa0NBQVc7QUFPeEI7SUFBQTtJQUlBLENBQUM7SUFBRCxxQkFBQztBQUFELENBSkEsQUFJQyxJQUFBO0FBSlksd0NBQWM7QUFNM0I7SUFBQTtJQUdBLENBQUM7SUFBRCx3QkFBQztBQUFELENBSEEsQUFHQyxJQUFBO0FBSFksOENBQWlCIiwiZmlsZSI6Im1vZGVscy9kb2N1bWVudC1saWJyYXJ5Lm1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTYgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLy8gbm90ZTogY29udGFpbnMgb25seSBsaW1pdGVkIHN1YnNldCBvZiBhdmFpbGFibGUgZmllbGRzXG5cbmltcG9ydCB7IE1pbmltYWxOb2RlRW50aXR5LCBNaW5pbWFsTm9kZUVudHJ5RW50aXR5IH0gZnJvbSAnYWxmcmVzY28tanMtYXBpJztcblxuZXhwb3J0IGNsYXNzIE5vZGVQYWdpbmcge1xuICAgIGxpc3Q6IE5vZGVQYWdpbmdMaXN0O1xufVxuXG5leHBvcnQgY2xhc3MgTm9kZVBhZ2luZ0xpc3Qge1xuICAgIHBhZ2luYXRpb246IFBhZ2luYXRpb247XG4gICAgZW50cmllczogTm9kZU1pbmltYWxFbnRyeVtdO1xufVxuXG5leHBvcnQgY2xhc3MgTm9kZU1pbmltYWxFbnRyeSBpbXBsZW1lbnRzIE1pbmltYWxOb2RlRW50aXR5IHtcbiAgICBlbnRyeTogTm9kZU1pbmltYWw7XG59XG5cbmV4cG9ydCBjbGFzcyBQYWdpbmF0aW9uIHtcbiAgICBjb3VudDogbnVtYmVyO1xuICAgIGhhc01vcmVJdGVtczogYm9vbGVhbjtcbiAgICB0b3RhbEl0ZW1zOiBudW1iZXI7XG4gICAgc2tpcENvdW50OiBudW1iZXI7XG4gICAgbWF4SXRlbXM6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIE5vZGVNaW5pbWFsIGltcGxlbWVudHMgTWluaW1hbE5vZGVFbnRyeUVudGl0eSB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBwYXJlbnRJZDogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBub2RlVHlwZTogc3RyaW5nO1xuICAgIGlzRm9sZGVyOiBib29sZWFuO1xuICAgIGlzRmlsZTogYm9vbGVhbjtcbiAgICBtb2RpZmllZEF0OiBEYXRlO1xuICAgIG1vZGlmaWVkQnlVc2VyOiBVc2VySW5mbztcbiAgICBjcmVhdGVkQXQ6IERhdGU7XG4gICAgY3JlYXRlZEJ5VXNlcjogVXNlckluZm87XG4gICAgY29udGVudDogQ29udGVudEluZm87XG4gICAgcGF0aDogUGF0aEluZm9FbnRpdHk7XG4gICAgcHJvcGVydGllczogTm9kZVByb3BlcnRpZXMgPSB7fTtcbn1cblxuZXhwb3J0IGNsYXNzIFVzZXJJbmZvIHtcbiAgICBkaXNwbGF5TmFtZTogc3RyaW5nO1xuICAgIGlkOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBDb250ZW50SW5mbyB7XG4gICAgbWltZVR5cGU6IHN0cmluZztcbiAgICBtaW1lVHlwZU5hbWU6IHN0cmluZztcbiAgICBzaXplSW5CeXRlczogbnVtYmVyO1xuICAgIGVuY29kaW5nOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBQYXRoSW5mb0VudGl0eSB7XG4gICAgZWxlbWVudHM6IFBhdGhFbGVtZW50RW50aXR5O1xuICAgIGlzQ29tcGxldGU6IGJvb2xlYW47XG4gICAgbmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgUGF0aEVsZW1lbnRFbnRpdHkge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVQcm9wZXJ0aWVzIHtcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG4iXX0=
