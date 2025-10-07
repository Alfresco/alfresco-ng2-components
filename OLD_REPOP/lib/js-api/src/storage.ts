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

export class Storage {
    private static instance: Storage;

    _storage: any;
    prefix: string;

    private constructor() {
        if (this.supportsStorage()) {
            this._storage = window.localStorage;
        }
    }

    public static getInstance() {
        if (!Storage.instance) {
            Storage.instance = new Storage();
        }
        return Storage.instance;
    }

    supportsStorage() {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch {
            return false;
        }
    }

    setDomainPrefix(prefix: any) {
        this.prefix = prefix ? prefix + '_' : '';
    }

    setStorage(storage: any) {
        this._storage = storage;
    }

    setItem(key: string, value: any) {
        if (this.supportsStorage()) {
            this._storage.setItem(this.prefix + key, value);
        }
    }

    removeItem(key: string) {
        if (this.supportsStorage()) {
            this._storage.removeItem(this.prefix + key);
        }
    }

    getItem(key: string) {
        if (this.supportsStorage()) {
            return this._storage.getItem(this.prefix + key);
        }
    }
}
