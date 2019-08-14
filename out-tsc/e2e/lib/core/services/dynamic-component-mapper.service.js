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
var get_type_1 = require("./get-type");
var DynamicComponentResolver = /** @class */ (function () {
    function DynamicComponentResolver() {
    }
    DynamicComponentResolver.fromType = function (type) {
        return get_type_1.getType(type);
    };
    return DynamicComponentResolver;
}());
exports.DynamicComponentResolver = DynamicComponentResolver;
var DynamicComponentMapper = /** @class */ (function () {
    function DynamicComponentMapper() {
        this.defaultValue = undefined;
        this.types = {};
    }
    /**
     * Gets the currently active DynamicComponentResolveFunction for a field type.
     * @param type The type whose resolver you want
     * @param defaultValue Default type returned for types that are not yet mapped
     * @returns Resolver function
     */
    DynamicComponentMapper.prototype.getComponentTypeResolver = function (type, defaultValue) {
        if (defaultValue === void 0) { defaultValue = this.defaultValue; }
        if (type) {
            return this.types[type] || DynamicComponentResolver.fromType(defaultValue);
        }
        return DynamicComponentResolver.fromType(defaultValue);
    };
    /**
     * Sets or optionally replaces a DynamicComponentResolveFunction for a field type.
     * @param type The type whose resolver you want to set
     * @param resolver The new resolver function
     * @param override The new resolver will only replace an existing one if this parameter is true
     */
    DynamicComponentMapper.prototype.setComponentTypeResolver = function (type, resolver, override) {
        if (override === void 0) { override = true; }
        if (!type) {
            throw new Error("type is null or not defined");
        }
        if (!resolver) {
            throw new Error("resolver is null or not defined");
        }
        var existing = this.types[type];
        if (existing && !override) {
            throw new Error("already mapped, use override option if you intend replacing existing mapping.");
        }
        this.types[type] = resolver;
    };
    /**
     * Finds the component type that is needed to render a form field.
     * @param model Form field model for the field to render
     * @param defaultValue Default type returned for field types that are not yet mapped.
     * @returns Component type
     */
    DynamicComponentMapper.prototype.resolveComponentType = function (model, defaultValue) {
        if (defaultValue === void 0) { defaultValue = this.defaultValue; }
        if (model) {
            var resolver = this.getComponentTypeResolver(model.type, defaultValue);
            return resolver(model);
        }
        return defaultValue;
    };
    return DynamicComponentMapper;
}());
exports.DynamicComponentMapper = DynamicComponentMapper;
//# sourceMappingURL=dynamic-component-mapper.service.js.map