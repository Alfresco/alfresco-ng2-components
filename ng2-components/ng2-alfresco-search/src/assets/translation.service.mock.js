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
var Rx_1 = require("rxjs/Rx");
var core_1 = require("@angular/core");
var TranslationMock = (function () {
    function TranslationMock() {
        this.onLangChange = new core_1.EventEmitter();
    }
    TranslationMock.prototype.get = function (key, interpolateParams) {
        return Rx_1.Observable.of(key);
    };
    TranslationMock.prototype.addTranslationFolder = function () {
    };
    return TranslationMock;
}());
exports.TranslationMock = TranslationMock;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy90cmFuc2xhdGlvbi5zZXJ2aWNlLm1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOztBQUVILDhCQUFxQztBQUNyQyxzQ0FBNkM7QUFPN0M7SUFBQTtRQUVXLGlCQUFZLEdBQWtDLElBQUksbUJBQVksRUFBbUIsQ0FBQztJQVM3RixDQUFDO0lBUFUsNkJBQUcsR0FBVixVQUFXLEdBQXlCLEVBQUUsaUJBQTBCO1FBQzVELE1BQU0sQ0FBQyxlQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCw4Q0FBb0IsR0FBcEI7SUFFQSxDQUFDO0lBQ0wsc0JBQUM7QUFBRCxDQVhBLEFBV0MsSUFBQTtBQVhZLDBDQUFlIiwiZmlsZSI6ImFzc2V0cy90cmFuc2xhdGlvbi5zZXJ2aWNlLm1vY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcy9SeCc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBMYW5nQ2hhbmdlRXZlbnQge1xuICAgIGxhbmc6IHN0cmluZztcbiAgICB0cmFuc2xhdGlvbnM6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9uTW9jayB7XG5cbiAgICBwdWJsaWMgb25MYW5nQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TGFuZ0NoYW5nZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TGFuZ0NoYW5nZUV2ZW50PigpO1xuXG4gICAgcHVibGljIGdldChrZXk6IHN0cmluZ3xBcnJheTxzdHJpbmc+LCBpbnRlcnBvbGF0ZVBhcmFtcz86IE9iamVjdCk6IE9ic2VydmFibGU8c3RyaW5nfGFueT4ge1xuICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZihrZXkpO1xuICAgIH1cblxuICAgIGFkZFRyYW5zbGF0aW9uRm9sZGVyKCkge1xuXG4gICAgfVxufVxuIl19
