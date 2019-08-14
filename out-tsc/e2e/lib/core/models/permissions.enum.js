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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/* spellchecker: disable */
var PermissionsEnum = /** @class */ (function (_super) {
    __extends(PermissionsEnum, _super);
    function PermissionsEnum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PermissionsEnum.CONTRIBUTOR = 'Contributor';
    PermissionsEnum.CONSUMER = 'Consumer';
    PermissionsEnum.COLLABORATOR = 'Collaborator';
    PermissionsEnum.MANAGER = 'Manager';
    PermissionsEnum.EDITOR = 'Editor';
    PermissionsEnum.COORDINATOR = 'Coordinator';
    PermissionsEnum.NOT_CONTRIBUTOR = '!Contributor';
    PermissionsEnum.NOT_CONSUMER = '!Consumer';
    PermissionsEnum.NOT_COLLABORATOR = '!Collaborator';
    PermissionsEnum.NOT_MANAGER = '!Manager';
    PermissionsEnum.NOT_EDITOR = '!Editor';
    PermissionsEnum.NOT_COORDINATOR = '!Coordinator';
    return PermissionsEnum;
}(String));
exports.PermissionsEnum = PermissionsEnum;
//# sourceMappingURL=permissions.enum.js.map