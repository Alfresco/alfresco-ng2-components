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
var SearchTermValidator = (function () {
    function SearchTermValidator() {
    }
    SearchTermValidator.minAlphanumericChars = function (minChars) {
        return function (control) {
            return ('' + control.value).replace(/[^0-9a-zA-Z]+/g, '').length >= minChars ? null : {
                hasMinAlphanumericChars: false
            };
        };
    };
    return SearchTermValidator;
}());
exports.SearchTermValidator = SearchTermValidator;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1zL3NlYXJjaC10ZXJtLXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7O0FBSUg7SUFBQTtJQVVBLENBQUM7SUFSVSx3Q0FBb0IsR0FBM0IsVUFBNEIsUUFBZ0I7UUFDeEMsTUFBTSxDQUFDLFVBQUMsT0FBb0I7WUFDeEIsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLFFBQVEsR0FBRyxJQUFJLEdBQUc7Z0JBQ2xGLHVCQUF1QixFQUFFLEtBQUs7YUFDakMsQ0FBQztRQUNOLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFTCwwQkFBQztBQUFELENBVkEsQUFVQyxJQUFBO0FBVlksa0RBQW1CIiwiZmlsZSI6ImZvcm1zL3NlYXJjaC10ZXJtLXZhbGlkYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE2IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5leHBvcnQgY2xhc3MgU2VhcmNoVGVybVZhbGlkYXRvciB7XG5cbiAgICBzdGF0aWMgbWluQWxwaGFudW1lcmljQ2hhcnMobWluQ2hhcnM6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gKGNvbnRyb2w6IEZvcm1Db250cm9sKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCcnICsgY29udHJvbC52YWx1ZSkucmVwbGFjZSgvW14wLTlhLXpBLVpdKy9nLCAnJykubGVuZ3RoID49IG1pbkNoYXJzID8gbnVsbCA6IHtcbiAgICAgICAgICAgICAgICBoYXNNaW5BbHBoYW51bWVyaWNDaGFyczogZmFsc2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfVxuXG59XG4iXX0=
