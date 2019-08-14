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
var BpmProductVersionModel = /** @class */ (function () {
    function BpmProductVersionModel(obj) {
        if (obj) {
            this.edition = obj.edition || null;
            this.majorVersion = obj.majorVersion || null;
            this.revisionVersion = obj.revisionVersion || null;
            this.minorVersion = obj.minorVersion || null;
            this.type = obj.type || null;
        }
    }
    return BpmProductVersionModel;
}());
exports.BpmProductVersionModel = BpmProductVersionModel;
var VersionModel = /** @class */ (function () {
    function VersionModel(obj) {
        if (obj) {
            this.major = obj.major || null;
            this.minor = obj.minor || null;
            this.patch = obj.patch || null;
            this.hotfix = obj.hotfix || null;
            this.schema = obj.schema || null;
            this.label = obj.label || null;
            this.display = obj.display || null;
        }
    }
    return VersionModel;
}());
exports.VersionModel = VersionModel;
var LicenseModel = /** @class */ (function () {
    function LicenseModel(obj) {
        if (obj) {
            this.issuedAt = obj.issuedAt || null;
            this.expiresAt = obj.expiresAt || null;
            this.remainingDays = obj.remainingDays || null;
            this.holder = obj.holder || null;
            this.mode = obj.mode || null;
            this.isClusterEnabled = obj.isClusterEnabled ? true : false;
            this.isCryptodocEnabled = obj.isCryptodocEnabled ? true : false;
        }
    }
    return LicenseModel;
}());
exports.LicenseModel = LicenseModel;
var VersionStatusModel = /** @class */ (function () {
    function VersionStatusModel(obj) {
        if (obj) {
            this.isReadOnly = obj.isReadOnly ? true : false;
            this.isAuditEnabled = obj.isAuditEnabled ? true : false;
            this.isQuickShareEnabled = obj.isQuickShareEnabled ? true : false;
            this.isThumbnailGenerationEnabled = obj.isThumbnailGenerationEnabled ? true : false;
        }
    }
    return VersionStatusModel;
}());
exports.VersionStatusModel = VersionStatusModel;
var VersionModuleModel = /** @class */ (function () {
    function VersionModuleModel(obj) {
        if (obj) {
            this.id = obj.id || null;
            this.title = obj.title || null;
            this.description = obj.description || null;
            this.version = obj.version || null;
            this.installDate = obj.installDate || null;
            this.installState = obj.installState || null;
            this.versionMin = obj.versionMin || null;
            this.versionMax = obj.versionMax || null;
        }
    }
    return VersionModuleModel;
}());
exports.VersionModuleModel = VersionModuleModel;
var EcmProductVersionModel = /** @class */ (function () {
    function EcmProductVersionModel(obj) {
        var _this = this;
        this.modules = [];
        if (obj && obj.entry && obj.entry.repository) {
            this.edition = obj.entry.repository.edition || null;
            this.version = new VersionModel(obj.entry.repository.version);
            this.license = new LicenseModel(obj.entry.repository.license);
            this.status = new VersionStatusModel(obj.entry.repository.status);
            if (obj.entry.repository.modules) {
                obj.entry.repository.modules.forEach(function (module) {
                    _this.modules.push(new VersionModuleModel(module));
                });
            }
        }
    }
    return EcmProductVersionModel;
}());
exports.EcmProductVersionModel = EcmProductVersionModel;
//# sourceMappingURL=product-version.model.js.map