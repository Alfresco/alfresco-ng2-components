/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { AlfrescoApi, AlfrescoApiConfig } from '@alfresco/js-api';
import { ReplaySubject } from 'rxjs';
import { OpenidConfiguration } from '../auth/interfaces/openid-configuration.interface';

/** @deprecated please use alfresco-api from \@alfresco/adf-content-services */
export const ALFRESCO_API_FACTORY = new InjectionToken('ALFRESCO_API_FACTORY');

/** @deprecated please do not use, it is created for mitigation impact of moving AlfrescoApiService into content lib */
export const CONTENT_ALFRESCO_API = new InjectionToken('CONTENT_API_FACTORY');

/**
 * The implementation of AlfrescoApiService was moved to @alfresco/adf-content-services,
 * to mitigate impact of this change, the core AlfrescoApiService works as a bridge for
 * \@alfresco/adf-content-services/alfresco-api, this mitigation works only if we have
 * ContentModule imported int our app (ContentModule provides CONTENT_ALFRESCO_API)
 * These code is going to be removed with core version 7.0.0
 */

/** @deprecated please use alfresco-api from \@alfresco/adf-content-services */
@Injectable({
    providedIn: 'root'
})
export class AlfrescoApiService {
    alfrescoApiInitialized: ReplaySubject<boolean>;
    lastConfig: AlfrescoApiConfig;
    currentAppConfig: AlfrescoApiConfig;
    idpConfig: OpenidConfiguration;

    getInstance(): AlfrescoApi {
        return this.alfrescoApiContentService.getInstance();
    }

    constructor(
        @Optional() @Inject(CONTENT_ALFRESCO_API) protected alfrescoApiContentService: any,
        @Optional() @Inject(ALFRESCO_API_FACTORY) private alfrescoApiFactory: any
    ) {
        if (this.alfrescoApiContentService) {
            this.alfrescoApiInitialized = this.alfrescoApiContentService.alfrescoApiInitialized;
            this.lastConfig = this.alfrescoApiContentService.alfrescoApiInitialized;
            this.currentAppConfig = this.alfrescoApiContentService.alfrescoApiInitialized;
            this.idpConfig = this.alfrescoApiContentService.alfrescoApiInitialized;

            if (this.alfrescoApiFactory) {
                // eslint-disable-next-line no-underscore-dangle
                this.alfrescoApiContentService._setFactory(this.alfrescoApiFactory);
            }
        }
    }

    async load(config: AlfrescoApiConfig): Promise<void> {
        this.alfrescoApiContentService.load(config);
    }

    async reset() {
        this.alfrescoApiContentService.reset();
    }

    createInstance(config: AlfrescoApiConfig): AlfrescoApi {
        return this.alfrescoApiContentService.createInstance(config);
    }

    isDifferentConfig(lastConfig: AlfrescoApiConfig, newConfig: AlfrescoApiConfig) {
        return this.alfrescoApiContentService.isDifferentConfig(lastConfig, newConfig);
    }

    isExcludedErrorListener(currentFullPath: string): boolean {
        return this.alfrescoApiContentService.isExcludedErrorListener(currentFullPath);
    }
}
