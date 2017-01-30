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
var EventMock = (function () {
    function EventMock() {
    }
    EventMock.keyDown = function (key) {
        var event = document.createEvent('Event');
        event.keyCode = key;
        event.initEvent('keydown');
        document.dispatchEvent(event);
    };
    EventMock.resizeMobileView = function () {
        window.dispatchEvent(new Event('resize'));
    };
    return EventMock;
}());
exports.EventMock = EventMock;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9ldmVudC5tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRzs7QUFFSDtJQUFBO0lBaUJBLENBQUM7SUFmVSxpQkFBTyxHQUFkLFVBQWUsR0FBUTtRQUNuQixJQUFJLEtBQUssR0FBUSxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sMEJBQWdCLEdBQXZCO1FBTUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDTCxnQkFBQztBQUFELENBakJBLEFBaUJDLElBQUE7QUFqQlksOEJBQVMiLCJmaWxlIjoiYXNzZXRzL2V2ZW50Lm1vY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY2xhc3MgRXZlbnRNb2NrIHtcblxuICAgIHN0YXRpYyBrZXlEb3duKGtleTogYW55KSB7XG4gICAgICAgIGxldCBldmVudDogYW55ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgIGV2ZW50LmtleUNvZGUgPSBrZXk7XG4gICAgICAgIGV2ZW50LmluaXRFdmVudCgna2V5ZG93bicpO1xuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzaXplTW9iaWxlVmlldygpIHtcbiAgICAgICAgLy8gdG9kbzogbm8gbG9uZ2VyIGNvbXBpbGVzIHdpdGggVFMgMi4wLjIgYXMgaW5uZXJXaWR0aC9pbm5lckhlaWdodCBhcmUgcmVhZG9ubHkgZmllbGRzXG4gICAgICAgIC8qXG4gICAgICAgIHdpbmRvdy5pbm5lcldpZHRoID0gMzIwO1xuICAgICAgICB3aW5kb3cuaW5uZXJIZWlnaHQgPSA1Njg7XG4gICAgICAgICovXG4gICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncmVzaXplJykpO1xuICAgIH1cbn1cbiJdfQ==
