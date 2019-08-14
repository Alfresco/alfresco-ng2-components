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
var protractor_1 = require("protractor");
var path = require("path");
var fs = require("fs");
var UploadActions = /** @class */ (function () {
    function UploadActions(alfrescoJsApi) {
        this.alfrescoJsApi = null;
        this.alfrescoJsApi = alfrescoJsApi;
    }
    UploadActions.prototype.uploadFile = function (fileLocation, fileName, parentFolderId) {
        return __awaiter(this, void 0, void 0, function () {
            var pathFile, file;
            return __generator(this, function (_a) {
                pathFile = path.join(protractor_1.browser.params.rootPath + '/e2e' + fileLocation);
                file = fs.createReadStream(pathFile);
                return [2 /*return*/, this.alfrescoJsApi.upload.uploadFile(file, '', parentFolderId, null, {
                        name: fileName,
                        nodeType: 'cm:content',
                        renditions: 'doclib'
                    })];
            });
        });
    };
    UploadActions.prototype.createEmptyFiles = function (emptyFileNames, parentFolderId) {
        return __awaiter(this, void 0, void 0, function () {
            var filesRequest, i, jsonItem;
            return __generator(this, function (_a) {
                filesRequest = [];
                for (i = 0; i < emptyFileNames.length; i++) {
                    jsonItem = {};
                    jsonItem['name'] = emptyFileNames[i];
                    jsonItem['nodeType'] = 'cm:content';
                    filesRequest.push(jsonItem);
                }
                return [2 /*return*/, this.alfrescoJsApi.nodes.addNode(parentFolderId, filesRequest, {})];
            });
        });
    };
    UploadActions.prototype.createFolder = function (folderName, parentFolderId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.alfrescoJsApi.node.addNode(parentFolderId, {
                        name: folderName,
                        nodeType: 'cm:folder'
                    }, {})];
            });
        });
    };
    UploadActions.prototype.deleteFileOrFolder = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.alfrescoJsApi.node.deleteNode(nodeId, { permanent: true })];
            });
        });
    };
    UploadActions.prototype.uploadFolder = function (sourcePath, folder) {
        return __awaiter(this, void 0, void 0, function () {
            var absolutePath, files, uploadedFiles, promises, _i, files_1, fileName, pathFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        absolutePath = 'e2e/' + sourcePath;
                        files = fs.readdirSync(path.join(protractor_1.browser.params.rootPath, absolutePath));
                        promises = [];
                        if (!(files && files.length > 0)) return [3 /*break*/, 2];
                        for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                            fileName = files_1[_i];
                            pathFile = path.join(sourcePath, fileName);
                            promises.push(this.uploadFile(pathFile, fileName, folder));
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        uploadedFiles = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, uploadedFiles];
                }
            });
        });
    };
    return UploadActions;
}());
exports.UploadActions = UploadActions;
//# sourceMappingURL=upload.actions.js.map