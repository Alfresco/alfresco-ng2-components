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
var alfresco_api_service_1 = require("./alfresco-api.service");
var moment_es6_1 = require("moment-es6");
var LockService = /** @class */ (function () {
    function LockService(alfrescoApiService) {
        this.alfrescoApiService = alfrescoApiService;
    }
    LockService.prototype.isLocked = function (node) {
        var isLocked = false;
        if (this.hasLockConfigured(node)) {
            if (this.isReadOnlyLock(node)) {
                isLocked = true;
                if (this.isLockExpired(node)) {
                    isLocked = false;
                }
            }
            else if (this.isLockOwnerAllowed(node)) {
                isLocked = this.alfrescoApiService.getInstance().getEcmUsername() !== node.properties['cm:lockOwner'].id;
                if (this.isLockExpired(node)) {
                    isLocked = false;
                }
            }
        }
        return isLocked;
    };
    LockService.prototype.hasLockConfigured = function (node) {
        return node.isFile && node.isLocked && node.properties['cm:lockType'];
    };
    LockService.prototype.isReadOnlyLock = function (node) {
        return node.properties['cm:lockType'] === 'READ_ONLY_LOCK' && node.properties['cm:lockLifetime'] === 'PERSISTENT';
    };
    LockService.prototype.isLockOwnerAllowed = function (node) {
        return node.properties['cm:lockType'] === 'WRITE_LOCK' && node.properties['cm:lockLifetime'] === 'PERSISTENT';
    };
    LockService.prototype.getLockExpiryTime = function (node) {
        if (node.properties['cm:expiryDate']) {
            return moment_es6_1.default(node.properties['cm:expiryDate'], 'yyyy-MM-ddThh:mm:ssZ');
        }
    };
    LockService.prototype.isLockExpired = function (node) {
        var expiryLockTime = this.getLockExpiryTime(node);
        return moment_es6_1.default().isAfter(expiryLockTime);
    };
    LockService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [alfresco_api_service_1.AlfrescoApiService])
    ], LockService);
    return LockService;
}());
exports.LockService = LockService;
//# sourceMappingURL=lock.service.js.map