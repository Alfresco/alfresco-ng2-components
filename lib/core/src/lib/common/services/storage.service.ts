/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private memoryStore: { [key: string]: any } = {};
    private readonly useLocalStorage: boolean = false;
    private _prefix: string = '';

    get prefix() {
        return this._prefix;
    }

    set prefix(prefix: string) {
        this._prefix = prefix ? prefix + '_' : '';
    }

    constructor() {
        this.useLocalStorage = this.storageAvailable('localStorage');
    }

    /**
     * Gets an item.
     *
     * @param key Key to identify the item
     * @returns The item (if any) retrieved by the key
     */
    getItem(key: string): string | null {
        if (this.useLocalStorage) {
            return localStorage.getItem(this.prefix + key);
        } else {
            return Object.prototype.hasOwnProperty.call(this.memoryStore, this.prefix + key) ? this.memoryStore[this.prefix + key] : null;
        }
    }

    /**
     * Gets all items from the storage.
     *
     * @returns All items stored
     */
    getItems(): { [key: string]: any } {
        const items: { [key: string]: any } = {};
        if (this.useLocalStorage) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith(this.prefix)) {
                    const keyWithoutPrefix = key.slice(this.prefix.length);
                    items[keyWithoutPrefix] = localStorage.getItem(key);
                }
            }
        } else {
            Object.keys(this.memoryStore).forEach((key) => {
                if (key.startsWith(this.prefix)) {
                    const unprefixedKey = key.slice(this.prefix.length);
                    items[unprefixedKey] = this.memoryStore[key];
                }
            });
        }

        return items;
    }

    /**
     * Stores an item
     *
     * @param key Key to identify the item
     * @param data Data to store
     */
    setItem(key: string, data: string) {
        if (this.useLocalStorage) {
            localStorage.setItem(this.prefix + key, data);
        } else {
            this.memoryStore[this.prefix + key] = data.toString();
        }
    }

    /** Removes all currently stored items. */
    clear() {
        if (this.useLocalStorage) {
            localStorage.clear();
        } else {
            this.memoryStore = {};
        }
    }

    /**
     * Removes a single item.
     *
     * @param key Key to identify the item
     */
    removeItem(key: string) {
        if (this.useLocalStorage) {
            localStorage.removeItem(`${this.prefix}` + key);
        } else {
            delete this.memoryStore[this.prefix + key];
        }
    }

    /**
     * Is any item currently stored under `key`?
     *
     * @param key Key identifying item to check
     * @returns True if key retrieves an item, false otherwise
     */
    hasItem(key: string): boolean {
        if (this.useLocalStorage) {
            return !!localStorage.getItem(this.prefix + key);
        } else {
            return Object.prototype.hasOwnProperty.call(this.memoryStore, key);
        }
    }

    private storageAvailable(type: string): boolean {
        try {
            const storage = window[type];
            const key = '__storage_test__';
            storage.setItem(key, key);
            storage.removeItem(key, key);
            return true;
        } catch (e) {
            return false;
        }
    }
}
