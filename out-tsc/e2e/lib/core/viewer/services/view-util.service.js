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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var alfresco_api_service_1 = require("../../services/alfresco-api.service");
var log_service_1 = require("../../services/log.service");
var ViewUtilService = /** @class */ (function () {
    function ViewUtilService(apiService, logService) {
        this.apiService = apiService;
        this.logService = logService;
        /**
         * Based on ViewerComponent Implementation, this value is used to determine how many times we try
         * to get the rendition of a file for preview, or printing.
         */
        this.maxRetries = 5;
        /**
         * Mime-type grouping based on the ViewerComponent.
         */
        this.mimeTypes = {
            text: ['text/plain', 'text/csv', 'text/xml', 'text/html', 'application/x-javascript'],
            pdf: ['application/pdf'],
            image: ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/svg+xml'],
            media: ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/ogg', 'audio/wav']
        };
    }
    ViewUtilService_1 = ViewUtilService;
    /**
     * This method takes a url to trigger the print dialog against, and the type of artifact that it
     * is.
     * This URL should be one that can be rendered in the browser, for example PDF, Image, or Text
     */
    ViewUtilService.prototype.printFile = function (url, type) {
        var pwa = window.open(url, ViewUtilService_1.TARGET);
        if (pwa) {
            // Because of the way chrome focus and close image window vs. pdf preview window
            if (type === ViewUtilService_1.ContentGroup.IMAGE) {
                pwa.onfocus = function () {
                    setTimeout(function () {
                        pwa.close();
                    }, 500);
                };
            }
            pwa.onload = function () {
                pwa.print();
            };
        }
    };
    /**
     * Launch the File Print dialog from anywhere other than the preview service, which resolves the
     * rendition of the object that can be printed from a web browser.
     * These are: images, PDF files, or PDF rendition of files.
     * We also force PDF rendition for TEXT type objects, otherwise the default URL is to download.
     * TODO there are different TEXT type objects, (HTML, plaintext, xml, etc. we should determine how these are handled)
     */
    ViewUtilService.prototype.printFileGeneric = function (objectId, mimeType) {
        var _this = this;
        var nodeId = objectId;
        var type = this.getViewerTypeByMimeType(mimeType);
        this.getRendition(nodeId, ViewUtilService_1.ContentGroup.PDF)
            .then(function (value) {
            var url = _this.getRenditionUrl(nodeId, type, (value ? true : false));
            var printType = (type === ViewUtilService_1.ContentGroup.PDF
                || type === ViewUtilService_1.ContentGroup.TEXT)
                ? ViewUtilService_1.ContentGroup.PDF : type;
            _this.printFile(url, printType);
        })
            .catch(function (err) {
            _this.logService.error('Error with Printing');
            _this.logService.error(err);
        });
    };
    ViewUtilService.prototype.getRenditionUrl = function (nodeId, type, renditionExists) {
        return (renditionExists && type !== ViewUtilService_1.ContentGroup.IMAGE) ?
            this.apiService.contentApi.getRenditionUrl(nodeId, ViewUtilService_1.ContentGroup.PDF) :
            this.apiService.contentApi.getContentUrl(nodeId, false);
    };
    ViewUtilService.prototype.waitRendition = function (nodeId, renditionId, retries) {
        return __awaiter(this, void 0, void 0, function () {
            var rendition, status_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apiService.renditionsApi.getRendition(nodeId, renditionId)];
                    case 1:
                        rendition = _a.sent();
                        if (!(this.maxRetries < retries)) return [3 /*break*/, 5];
                        status_1 = rendition.entry.status.toString();
                        if (!(status_1 === 'CREATED')) return [3 /*break*/, 2];
                        return [2 /*return*/, rendition];
                    case 2:
                        retries += 1;
                        return [4 /*yield*/, this.wait(1000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.waitRendition(nodeId, renditionId, retries)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ViewUtilService.prototype.getViewerTypeByMimeType = function (mimeType) {
        if (mimeType) {
            mimeType = mimeType.toLowerCase();
            var editorTypes = Object.keys(this.mimeTypes);
            for (var _i = 0, editorTypes_1 = editorTypes; _i < editorTypes_1.length; _i++) {
                var type = editorTypes_1[_i];
                if (this.mimeTypes[type].indexOf(mimeType) >= 0) {
                    return type;
                }
            }
        }
        return 'unknown';
    };
    ViewUtilService.prototype.wait = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    ViewUtilService.prototype.getRendition = function (nodeId, renditionId) {
        return __awaiter(this, void 0, void 0, function () {
            var renditionPaging, rendition, status_2, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.apiService.renditionsApi.getRenditions(nodeId)];
                    case 1:
                        renditionPaging = _a.sent();
                        rendition = renditionPaging.list.entries.find(function (renditionEntry) { return renditionEntry.entry.id.toLowerCase() === renditionId; });
                        if (!rendition) return [3 /*break*/, 6];
                        status_2 = rendition.entry.status.toString();
                        if (!(status_2 === 'NOT_CREATED')) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.apiService.renditionsApi.createRendition(nodeId, { id: renditionId })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.waitRendition(nodeId, renditionId, 0)];
                    case 4:
                        rendition = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        this.logService.error(err_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, new Promise(function (resolve) { return resolve(rendition); })];
                }
            });
        });
    };
    var ViewUtilService_1;
    ViewUtilService.TARGET = '_new';
    /**
     * Content groups based on categorization of files that can be viewed in the web browser. This
     * implementation or grouping is tied to the definition the ng component: ViewerComponent
     */
    // tslint:disable-next-line:variable-name
    ViewUtilService.ContentGroup = {
        IMAGE: 'image',
        MEDIA: 'media',
        PDF: 'pdf',
        TEXT: 'text'
    };
    ViewUtilService = ViewUtilService_1 = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService,
            log_service_1.LogService])
    ], ViewUtilService);
    return ViewUtilService;
}());
exports.ViewUtilService = ViewUtilService;
//# sourceMappingURL=view-util.service.js.map