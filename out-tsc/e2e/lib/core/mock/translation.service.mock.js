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
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var TranslationMock = /** @class */ (function () {
    function TranslationMock() {
        this.defaultLang = 'en';
        this.translate = {
            onLangChange: new core_1.EventEmitter()
        };
    }
    TranslationMock.prototype.addTranslationFolder = function () { };
    TranslationMock.prototype.onTranslationChanged = function () { };
    TranslationMock.prototype.use = function () { };
    TranslationMock.prototype.loadTranslation = function () { };
    TranslationMock.prototype.get = function (key, interpolateParams) {
        return rxjs_1.of(key);
    };
    TranslationMock.prototype.instant = function (key, interpolateParams) {
        return key;
    };
    return TranslationMock;
}());
exports.TranslationMock = TranslationMock;
//# sourceMappingURL=translation.service.mock.js.map