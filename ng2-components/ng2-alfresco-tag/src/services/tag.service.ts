/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {Injectable} from '@angular/core';
import {AlfrescoAuthenticationService} from 'ng2-alfresco-core';

/**
 *
 * This component, provide a list of the tags relative a node with actions button to add or remove new tag
 *
 * @returns {TagComponent} .
 */
declare let __moduleName: string;

@Injectable()
export class TagService {

    cacheTagList: any = [];

    promiseCache: any;

    /**
     * Constructor
     * @param authService
     */
    constructor(public authService: AlfrescoAuthenticationService) {
        this.promiseCache = new Promise((resolve) => {
            this.getAllTheTags().then((data) => {
                this.cacheTagList = data;
                resolve(data);
            });
        });
    }

    getTagsByProperties(properties: string) {
        return new Promise((resolve) => {
            if (!this.cacheTagList) {
                this.promiseCache.then((data) => {
                    this.cacheTagList = data;
                    resolve(this._associateTagByNodeProperties(properties, data));
                });
            } else {
                resolve(this._associateTagByNodeProperties(properties, this.cacheTagList));
            }
        });
    }

    _associateTagByNodeProperties(properties: any, tagList: any) {
        let tagsArray = [];
        if (properties) {
            try {
                let jsonProps;

                if (typeof properties !== 'object') {
                    jsonProps = JSON.parse(properties);
                } else {
                    jsonProps = properties;
                }

                if (jsonProps.hasOwnProperty('cm:taggable')) {
                    jsonProps['cm:taggable'].forEach((currentTagId) => {
                        if (tagList && tagList.length > 0) {
                            let tag = tagList.filter((currentCacheTag) => {
                                if (currentCacheTag.entry.id === currentTagId) {
                                    return currentCacheTag.entry;
                                }
                            });
                            if (tag && tag.length > 0) {
                                tagsArray.push(tag[0]);
                            }
                        }
                    });
                }
            } catch (error) {
                console.log('error' + error);
            }
        }
        return tagsArray;
    }

    getTagsByNodeId(nodeId: string): any {
        return new Promise((resolve, reject) => {
            this.authService.getAlfrescoApi().core.tagsApi.getNodeTags(nodeId).then((data) => {
                resolve(data.list.entries);
            }, function (error) {
                console.log('Error' + error);
                reject();
            });
        });
    }

    getAllTheTags() {
        return new Promise((resolve, reject) => {
            this.authService.getAlfrescoApi().core.tagsApi.getTags().then((data) => {
                resolve(data.list.entries);
            }, function (error) {
                console.log('Error' + error);
                reject();
            });
        });
    }

    addTag(nodeId: string, tagName: string): any {
        return new Promise((resolve, reject) => {
            let alfrescoApi = this.authService.getAlfrescoApi();
            let tagBody = new alfrescoApi.core.TagBody();
            tagBody.tag = tagName;
            this.authService.getAlfrescoApi().core.tagsApi.addTag(nodeId, tagBody).then((res) => {
                this.cacheTagList.push(res);
                resolve(res);
            }, function (error) {
                console.log('Error' + error);
                reject();
            });
        });
    }

    removeTag(nodeId: string, tag: string): any {
        return new Promise((resolve, reject) => {
            this.authService.getAlfrescoApi().core.tagsApi.removeTag(nodeId, tag).then(() => {
                resolve();
            }, function (error) {
                console.log('Error' + error);
                reject();
            });
        });
    }
}
