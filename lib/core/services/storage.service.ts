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

import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private memoryStore: { [key: string]: any } = {};
    private useLocalStorage: boolean = false;
    storagePrefix: string;

    constructor(private appConfigService: AppConfigService) {
        this.useLocalStorage = this.storageAvailable('localStorage');
        this.appConfigService.onLoad.subscribe(this.getAppPrefix.bind(this));
    }

    /**
     * Gets an item.
     * @param key Key to identify the item
     * @returns The item (if any) retrieved by the key
     */
    getItem(key: string): string | null {
        if (this.useLocalStorage) {
            return localStorage.getItem(this.storagePrefix + key);
        } else {
            return this.memoryStore.hasOwnProperty(this.storagePrefix + key) ? this.memoryStore[this.storagePrefix + key] : null;
        }
    }

    /**
     * Stores an item
     * @param key Key to identify the item
     * @param data Data to store
     */
    setItem(key: string, data: string) {
        if (this.useLocalStorage) {
            localStorage.setItem(this.storagePrefix + key, data);
        } else {
            this.memoryStore[this.storagePrefix + key] = data.toString();
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
     * @param key Key to identify the item
     */
    removeItem(key: string) {
        if (this.useLocalStorage) {
            localStorage.removeItem(this.storagePrefix + key);
        } else {
            delete this.memoryStore[this.storagePrefix + key];
        }
    }

    /**
     * Is any item currently stored under `key`?
     * @param key Key identifying item to check
     * @returns True if key retrieves an item, false otherwise
     */
    hasItem(key: string): boolean {
        if (this.useLocalStorage) {
            return localStorage.getItem(this.storagePrefix + key) ? true : false;
        } else {
            return this.memoryStore.hasOwnProperty(key);
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

    /**
     * Sets the prefix that is used for the local storage of the app
     * It assigns the string that is defined i the app config,
     * empty prefix otherwise.
     */
    getAppPrefix() {
        const appConfiguration = this.appConfigService.get<any>('application');
        if (appConfiguration && appConfiguration.storagePrefix) {
            this.storagePrefix = appConfiguration.storagePrefix + '_';
        } else {
            this.storagePrefix = '';
        }
    }

}
