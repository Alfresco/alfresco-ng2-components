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

import { Api } from './api';
import { Logger } from '../../../core/utils/logger';
import { ContentApi } from '../content-api';
import { FavoritesApi as AdfFavoritesApi, SitesApi as AdfSitesApi, FavoriteEntry, FavoritePaging, AlfrescoApi } from '@alfresco/js-api';
import { ApiUtil } from '../../../core/structure/api.util';

export class FavoritesApi extends Api {
  favoritesApi: AdfFavoritesApi;
  sitesApi: AdfSitesApi;

  constructor(username: string, password: string, alfrescoJsApi: AlfrescoApi) {
    super(username, password, alfrescoJsApi);
    this.favoritesApi = new AdfFavoritesApi(alfrescoJsApi);
    this.sitesApi = new AdfSitesApi(alfrescoJsApi);
  }

  async addFavorite(api: ContentApi, nodeType: string, name: string): Promise<FavoriteEntry> {
    try {
      const nodeId = (await api.nodes.getNodeByPath(name)).entry.id;
      const data = {
          target: {
              [nodeType]: {
                  guid: nodeId
              }
          }
      };
      return await this.favoritesApi.createFavorite('-me-', data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.addFavorite.name}`, error);
      return null;
    }
  }

  async addFavoriteById(nodeType: 'file' | 'folder' | 'site', id: string): Promise<FavoriteEntry> {
    let guid;
    try {
      await this.apiLogin();
      if ( nodeType === 'site' ) {
        guid = (await this.sitesApi.getSite(id)).entry.guid;
      } else {
        guid = id;
      }
      const data = {
        target: {
          [nodeType]: {
            guid: guid
          }
        }
      };
      return await this.favoritesApi.createFavorite('-me-', data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.addFavoriteById.name}`, error);
      return null;
    }
  }

  async addFavoritesByIds(nodeType: 'file' | 'folder' | 'site', ids: string[]): Promise<void> {
    try {
      return await ids.reduce(async (previous, current) => {
        await previous;
        await this.addFavoriteById(nodeType, current);
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.addFavoritesByIds.name}`, error);
    }
  }

  async getFavorites(): Promise<FavoritePaging> {
    try {
      await this.apiLogin();
      return await this.favoritesApi.listFavorites(this.getUsername());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getFavorites.name}`, error);
      return null;
    }
  }

  async getFavoriteById(nodeId: string): Promise<FavoriteEntry> {
    try {
      await this.apiLogin();
      return await this.favoritesApi.getFavorite('-me-', nodeId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getFavoriteById.name}`, error);
      return null;
    }
  }

  async isFavorite(nodeId: string): Promise<boolean> {
    try {
      return JSON.stringify((await this.getFavorites()).list.entries).includes(nodeId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.isFavorite.name}`, error);
      return null;
    }
  }

  async isFavoriteWithRetry(nodeId: string, data: { expect: boolean }): Promise<any> {
    let isFavorite: boolean;
    try {
      const favorite = async () => {
        isFavorite = await this.isFavorite(nodeId);
        if ( isFavorite !== data.expect ) {
          return Promise.reject(isFavorite);
        } else {
          return Promise.resolve(isFavorite);
        }
      };
      return await ApiUtil.retryCall(favorite);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.isFavoriteWithRetry.name}`, error);
    }
    return isFavorite;
  }

  async removeFavoriteById(nodeId: string): Promise<any> {
    try {
      await this.apiLogin();
      return await this.favoritesApi.deleteFavorite('-me-', nodeId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.removeFavoriteById.name}`, error);
    }
  }

  async removeFavoritesByIds(ids: string[]): Promise<void> {
    try {
      return await ids.reduce(async (previous, current) => {
        await previous;
        await this.removeFavoriteById(current);
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.removeFavoritesByIds.name}`, error);
    }
  }

  async waitForApi(data: { expect: number }): Promise<any> {
    try {
      const favoriteFiles = async () => {
        const totalItems = (await this.getFavorites()).list.pagination.totalItems;
        if ( totalItems !== data.expect) {
            return Promise.reject(totalItems);
        } else {
            return Promise.resolve(totalItems);
        }
      };
      return await ApiUtil.retryCall(favoriteFiles);
    } catch (error) {
      Logger.error(`${this.constructor.name} ${this.waitForApi.name} catch: `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
