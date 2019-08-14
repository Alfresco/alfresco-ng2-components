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
var StorageService = /** @class */ (function () {
    function StorageService() {
        this.memoryStore = {};
        this.useLocalStorage = false;
        this._prefix = '';
        this.useLocalStorage = this.storageAvailable('localStorage');
    }
    Object.defineProperty(StorageService.prototype, "prefix", {
        get: function () {
            return this._prefix;
        },
        set: function (prefix) {
            this._prefix = prefix ? prefix + '_' : '';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets an item.
     * @param key Key to identify the item
     * @returns The item (if any) retrieved by the key
     */
    StorageService.prototype.getItem = function (key) {
        if (this.useLocalStorage) {
            return localStorage.getItem(this.prefix + key);
        }
        else {
            return this.memoryStore.hasOwnProperty(this.prefix + key) ? this.memoryStore[this.prefix + key] : null;
        }
    };
    /**
     * Stores an item
     * @param key Key to identify the item
     * @param data Data to store
     */
    StorageService.prototype.setItem = function (key, data) {
        if (this.useLocalStorage) {
            localStorage.setItem(this.prefix + key, data);
        }
        else {
            this.memoryStore[this.prefix + key] = data.toString();
        }
    };
    /** Removes all currently stored items. */
    StorageService.prototype.clear = function () {
        if (this.useLocalStorage) {
            localStorage.clear();
        }
        else {
            this.memoryStore = {};
        }
    };
    /**
     * Removes a single item.
     * @param key Key to identify the item
     */
    StorageService.prototype.removeItem = function (key) {
        if (this.useLocalStorage) {
            localStorage.removeItem(this.prefix + key);
        }
        else {
            delete this.memoryStore[this.prefix + key];
        }
    };
    /**
     * Is any item currently stored under `key`?
     * @param key Key identifying item to check
     * @returns True if key retrieves an item, false otherwise
     */
    StorageService.prototype.hasItem = function (key) {
        if (this.useLocalStorage) {
            return localStorage.getItem(this.prefix + key) ? true : false;
        }
        else {
            return this.memoryStore.hasOwnProperty(key);
        }
    };
    StorageService.prototype.storageAvailable = function (type) {
        try {
            var storage = window[type];
            var key = '__storage_test__';
            storage.setItem(key, key);
            storage.removeItem(key, key);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    StorageService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], StorageService);
    return StorageService;
}());
exports.StorageService = StorageService;
//# sourceMappingURL=storage.service.js.map