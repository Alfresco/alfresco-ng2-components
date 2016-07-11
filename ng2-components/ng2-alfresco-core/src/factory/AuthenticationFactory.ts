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

import { AbstractAuthentication } from '../interface/authentication.interface';
import { AlfrescoAuthenticationBPM } from '../services/AlfrescoAuthenticationBPM.service';
import { AlfrescoAuthenticationECM } from '../services/AlfrescoAuthenticationECM.service';
import { Http } from '@angular/http';
import { AlfrescoSettingsService } from '../services/AlfrescoSettingsService.service';


export class AuthenticationFactory {

    public static createAuth(alfrescoSettingsService: AlfrescoSettingsService,
                             http: Http,
                             type: string): AbstractAuthentication {
        if (type === 'ECM') {
            return new AlfrescoAuthenticationECM(alfrescoSettingsService, http);
        } else if (type === 'BPM') {
            return new AlfrescoAuthenticationBPM(alfrescoSettingsService, http);
        }
        return null;
    }
}
