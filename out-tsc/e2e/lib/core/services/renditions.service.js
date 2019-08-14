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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var alfresco_api_service_1 = require("./alfresco-api.service");
var operators_1 = require("rxjs/operators");
var RenditionsService = /** @class */ (function () {
    function RenditionsService(apiService) {
        this.apiService = apiService;
    }
    /**
     * Gets the first available rendition found for a node.
     * @param nodeId ID of the target node
     * @returns Information object for the rendition
     */
    RenditionsService.prototype.getAvailableRenditionForNode = function (nodeId) {
        return rxjs_1.from(this.apiService.renditionsApi.getRenditions(nodeId)).pipe(operators_1.map(function (availableRenditions) {
            var renditionsAvailable = availableRenditions.list.entries.filter(function (rendition) { return (rendition.entry.id === 'pdf' || rendition.entry.id === 'imgpreview'); });
            var existingRendition = renditionsAvailable.find(function (rend) { return rend.entry.status === 'CREATED'; });
            return existingRendition ? existingRendition : renditionsAvailable[0];
        }));
    };
    /**
     * Generates a rendition for a node using the first available encoding.
     * @param nodeId ID of the target node
     * @returns Null response to indicate completion
     */
    RenditionsService.prototype.generateRenditionForNode = function (nodeId) {
        var _this = this;
        return this.getAvailableRenditionForNode(nodeId).pipe(operators_1.map(function (rendition) {
            if (rendition.entry.status !== 'CREATED') {
                return rxjs_1.from(_this.apiService.renditionsApi.createRendition(nodeId, { id: rendition.entry.id }));
            }
            else {
                return rxjs_1.empty();
            }
        }));
    };
    /**
     * Checks if the specified rendition is available for a node.
     * @param nodeId ID of the target node
     * @param encoding Name of the rendition encoding
     * @returns True if the rendition is available, false otherwise
     */
    RenditionsService.prototype.isRenditionAvailable = function (nodeId, encoding) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.getRendition(nodeId, encoding).subscribe(function (res) {
                var isAvailable = true;
                if (res.entry.status.toString() === 'NOT_CREATED') {
                    isAvailable = false;
                }
                observer.next(isAvailable);
                observer.complete();
            }, function () {
                observer.next(false);
                observer.complete();
            });
        });
    };
    /**
     * Checks if the node can be converted using the specified rendition.
     * @param nodeId ID of the target node
     * @param encoding Name of the rendition encoding
     * @returns True if the node can be converted, false otherwise
     */
    RenditionsService.prototype.isConversionPossible = function (nodeId, encoding) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.getRendition(nodeId, encoding).subscribe(function () {
                observer.next(true);
                observer.complete();
            }, function () {
                observer.next(false);
                observer.complete();
            });
        });
    };
    /**
     * Gets a URL linking to the specified rendition of a node.
     * @param nodeId ID of the target node
     * @param encoding Name of the rendition encoding
     * @returns URL string
     */
    RenditionsService.prototype.getRenditionUrl = function (nodeId, encoding) {
        return this.apiService.contentApi.getRenditionUrl(nodeId, encoding);
    };
    /**
     * Gets information about a rendition of a node.
     * @param nodeId ID of the target node
     * @param encoding Name of the rendition encoding
     * @returns Information object about the rendition
     */
    RenditionsService.prototype.getRendition = function (nodeId, encoding) {
        return rxjs_1.from(this.apiService.renditionsApi.getRendition(nodeId, encoding));
    };
    /**
     * Gets a list of all renditions for a node.
     * @param nodeId ID of the target node
     * @returns Paged list of rendition details
     */
    RenditionsService.prototype.getRenditionsListByNodeId = function (nodeId) {
        return rxjs_1.from(this.apiService.renditionsApi.getRenditions(nodeId));
    };
    /**
     * Creates a rendition for a node.
     * @param nodeId ID of the target node
     * @param encoding Name of the rendition encoding
     * @returns Null response to indicate completion
     */
    RenditionsService.prototype.createRendition = function (nodeId, encoding) {
        return rxjs_1.from(this.apiService.renditionsApi.createRendition(nodeId, { id: encoding }));
    };
    /**
     * Repeatedly attempts to create a rendition, through to success or failure.
     * @param nodeId ID of the target node
     * @param encoding Name of the rendition encoding
     * @param pollingInterval Time interval (in milliseconds) between checks for completion
     * @param retries Number of attempts to make before declaring failure
     * @returns True if the rendition was created, false otherwise
     */
    RenditionsService.prototype.convert = function (nodeId, encoding, pollingInterval, retries) {
        var _this = this;
        if (pollingInterval === void 0) { pollingInterval = 1000; }
        if (retries === void 0) { retries = 5; }
        return this.createRendition(nodeId, encoding)
            .pipe(operators_1.concatMap(function () { return _this.pollRendition(nodeId, encoding, pollingInterval, retries); }));
    };
    RenditionsService.prototype.pollRendition = function (nodeId, encoding, intervalSize, retries) {
        var _this = this;
        if (intervalSize === void 0) { intervalSize = 1000; }
        if (retries === void 0) { retries = 5; }
        var attempts = 0;
        return rxjs_1.interval(intervalSize)
            .pipe(operators_1.switchMap(function () { return _this.getRendition(nodeId, encoding); }), operators_1.takeWhile(function (renditionEntry) {
            attempts += 1;
            if (attempts > retries) {
                return false;
            }
            return (renditionEntry.entry.status.toString() !== 'CREATED');
        }));
    };
    RenditionsService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService])
    ], RenditionsService);
    return RenditionsService;
}());
exports.RenditionsService = RenditionsService;
//# sourceMappingURL=renditions.service.js.map