"use strict";
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
Object.defineProperty(exports, "__esModule", { value: true });
var EventMock = /** @class */ (function () {
    function EventMock() {
    }
    EventMock.keyDown = function (key) {
        var event = document.createEvent('Event');
        event.keyCode = key;
        event.initEvent('keydown');
        document.dispatchEvent(event);
    };
    EventMock.keyUp = function (key) {
        var event = document.createEvent('Event');
        event.keyCode = key;
        event.initEvent('keyup');
        document.dispatchEvent(event);
    };
    EventMock.resizeMobileView = function () {
        // todo: no longer compiles with TS 2.0.2 as innerWidth/innerHeight are readonly fields
        /*
        window.innerWidth = 320;
        window.innerHeight = 568;
        */
        window.dispatchEvent(new Event('resize'));
    };
    return EventMock;
}());
exports.EventMock = EventMock;
//# sourceMappingURL=event.mock.js.map