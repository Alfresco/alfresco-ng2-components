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
var jwt_helper_service_1 = require("./jwt-helper.service");
var router_1 = require("@angular/router");
var AuthGuardSsoRoleService = /** @class */ (function () {
    function AuthGuardSsoRoleService(jwtHelperService, router) {
        this.jwtHelperService = jwtHelperService;
        this.router = router;
    }
    AuthGuardSsoRoleService.prototype.canActivate = function (route, state) {
        var hasRole;
        var hasRealmRole = false;
        var hasClientRole = true;
        if (route.data) {
            if (route.data['roles']) {
                var rolesToCheck = route.data['roles'];
                hasRealmRole = this.hasRealmRoles(rolesToCheck);
            }
            if (route.data['clientRoles']) {
                var clientRoleName = route.params[route.data['clientRoles']];
                var rolesToCheck = route.data['roles'];
                hasClientRole = this.hasRealmRolesForClientRole(clientRoleName, rolesToCheck);
            }
        }
        hasRole = hasRealmRole && hasClientRole;
        if (!hasRole && route.data && route.data['redirectUrl']) {
            this.router.navigate(['/' + route.data['redirectUrl']]);
        }
        return hasRole;
    };
    AuthGuardSsoRoleService.prototype.getRealmRoles = function () {
        var access = this.jwtHelperService.getValueFromLocalAccessToken('realm_access');
        return access ? access['roles'] : [];
    };
    AuthGuardSsoRoleService.prototype.getClientRoles = function (client) {
        var clientRole = this.jwtHelperService.getValueFromLocalAccessToken('resource_access')[client];
        return clientRole ? clientRole['roles'] : [];
    };
    AuthGuardSsoRoleService.prototype.hasRealmRole = function (role) {
        var hasRole = false;
        if (this.jwtHelperService.getAccessToken()) {
            var realmRoles = this.getRealmRoles();
            hasRole = realmRoles.some(function (currentRole) {
                return currentRole === role;
            });
        }
        return hasRole;
    };
    AuthGuardSsoRoleService.prototype.hasRealmRoles = function (rolesToCheck) {
        var _this = this;
        return rolesToCheck.some(function (currentRole) {
            return _this.hasRealmRole(currentRole);
        });
    };
    AuthGuardSsoRoleService.prototype.hasRealmRolesForClientRole = function (clientRole, rolesToCheck) {
        var _this = this;
        return rolesToCheck.some(function (currentRole) {
            return _this.hasClientRole(clientRole, currentRole);
        });
    };
    AuthGuardSsoRoleService.prototype.hasClientRole = function (clientRole, role) {
        var hasRole = false;
        if (this.jwtHelperService.getAccessToken()) {
            var clientRoles = this.getClientRoles(clientRole);
            hasRole = clientRoles.some(function (currentRole) {
                return currentRole === role;
            });
        }
        return hasRole;
    };
    AuthGuardSsoRoleService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [jwt_helper_service_1.JwtHelperService, router_1.Router])
    ], AuthGuardSsoRoleService);
    return AuthGuardSsoRoleService;
}());
exports.AuthGuardSsoRoleService = AuthGuardSsoRoleService;
//# sourceMappingURL=auth-guard-sso-role.service.js.map