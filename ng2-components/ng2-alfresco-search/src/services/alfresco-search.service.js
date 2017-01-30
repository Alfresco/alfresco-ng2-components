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
var Rx_1 = require("rxjs/Rx");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var AlfrescoSearchService = (function () {
    function AlfrescoSearchService(authService, apiService) {
        this.authService = authService;
        this.apiService = apiService;
    }
    AlfrescoSearchService.prototype.getNodeQueryResults = function (term, options) {
        return Rx_1.Observable.fromPromise(this.getQueryNodesPromise(term, options))
            .map(function (res) { return res; })
            .catch(this.handleError);
    };
    AlfrescoSearchService.prototype.getQueryNodesPromise = function (term, opts) {
        return this.apiService.getInstance().core.queriesApi.findNodes(term, opts);
    };
    AlfrescoSearchService.prototype.handleError = function (error) {
        return Rx_1.Observable.throw(error || 'Server error');
    };
    return AlfrescoSearchService;
}());
AlfrescoSearchService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ng2_alfresco_core_1.AlfrescoAuthenticationService, ng2_alfresco_core_1.AlfrescoApiService])
], AlfrescoSearchService);
exports.AlfrescoSearchService = AlfrescoSearchService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL2FsZnJlc2NvLXNlYXJjaC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkM7QUFDM0MsOEJBQXFDO0FBQ3JDLHVEQUFzRjtBQU10RixJQUFhLHFCQUFxQjtJQUU5QiwrQkFBbUIsV0FBMEMsRUFBVSxVQUE4QjtRQUFsRixnQkFBVyxHQUFYLFdBQVcsQ0FBK0I7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFvQjtJQUNyRyxDQUFDO0lBU00sbURBQW1CLEdBQTFCLFVBQTJCLElBQVksRUFBRSxPQUF1QjtRQUM1RCxNQUFNLENBQUMsZUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ2xFLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFNLEdBQUcsRUFBVCxDQUFTLENBQUM7YUFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU8sb0RBQW9CLEdBQTVCLFVBQTZCLElBQVksRUFBRSxJQUFtQjtRQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVPLDJDQUFXLEdBQW5CLFVBQW9CLEtBQVU7UUFDMUIsTUFBTSxDQUFDLGVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLGNBQWMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDTCw0QkFBQztBQUFELENBekJBLEFBeUJDLElBQUE7QUF6QlkscUJBQXFCO0lBRGpDLGlCQUFVLEVBQUU7cUNBR3VCLGlEQUE2QixFQUFzQixzQ0FBa0I7R0FGNUYscUJBQXFCLENBeUJqQztBQXpCWSxzREFBcUIiLCJmaWxlIjoic2VydmljZXMvYWxmcmVzY28tc2VhcmNoLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9SeCc7XG5pbXBvcnQgeyBBbGZyZXNjb0F1dGhlbnRpY2F0aW9uU2VydmljZSwgQWxmcmVzY29BcGlTZXJ2aWNlIH0gZnJvbSAnbmcyLWFsZnJlc2NvLWNvcmUnO1xuXG4vKipcbiAqIEludGVybmFsIHNlcnZpY2UgdXNlZCBieSBEb2N1bWVudCBMaXN0IGNvbXBvbmVudC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEFsZnJlc2NvU2VhcmNoU2VydmljZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYXV0aFNlcnZpY2U6IEFsZnJlc2NvQXV0aGVudGljYXRpb25TZXJ2aWNlLCBwcml2YXRlIGFwaVNlcnZpY2U6IEFsZnJlc2NvQXBpU2VydmljZSkge1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgYSBzZWFyY2ggYWdhaW5zdCB0aGUgcmVwb3NpdG9yeVxuICAgICAqXG4gICAgICogQHBhcmFtIHRlcm0gU2VhcmNoIHRlcm1cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBBZGRpdGlvbmFsIG9wdGlvbnMgcGFzc2VkIHRvIHRoZSBzZWFyY2hcbiAgICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxOb2RlUGFnaW5nPn0gU2VhcmNoIHJlc3VsdHNcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Tm9kZVF1ZXJ5UmVzdWx0cyh0ZXJtOiBzdHJpbmcsIG9wdGlvbnM/OiBTZWFyY2hPcHRpb25zKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbVByb21pc2UodGhpcy5nZXRRdWVyeU5vZGVzUHJvbWlzZSh0ZXJtLCBvcHRpb25zKSlcbiAgICAgICAgICAgIC5tYXAocmVzID0+IDxhbnk+IHJlcylcbiAgICAgICAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFF1ZXJ5Tm9kZXNQcm9taXNlKHRlcm06IHN0cmluZywgb3B0czogU2VhcmNoT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkuY29yZS5xdWVyaWVzQXBpLmZpbmROb2Rlcyh0ZXJtLCBvcHRzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZUVycm9yKGVycm9yOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS50aHJvdyhlcnJvciB8fCAnU2VydmVyIGVycm9yJyk7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlYXJjaE9wdGlvbnMge1xuICAgIHNraXBDb3VudD86IG51bWJlcjtcbiAgICBtYXhJdGVtcz86IG51bWJlcjtcbiAgICByb290Tm9kZUlkPzogc3RyaW5nO1xuICAgIG5vZGVUeXBlPzogc3RyaW5nO1xuICAgIGluY2x1ZGU/OiBzdHJpbmdbXTtcbiAgICBvcmRlckJ5Pzogc3RyaW5nO1xuICAgIGZpZWxkcz86IHN0cmluZ1tdO1xufVxuIl19
