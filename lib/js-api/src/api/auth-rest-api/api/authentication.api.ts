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

import { TicketBody } from '../model/ticketBody';
import { TicketEntry } from '../model/ticketEntry';
import { ValidTicketEntry } from '../model/validTicketEntry';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * Authentication service.
 */
export class AuthenticationApi extends BaseApi {
    /**
     * Create ticket (login)
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * @param ticketBodyCreate The user credential.
     * @returns Promise<TicketEntry>
     */
    createTicket(ticketBodyCreate: TicketBody): Promise<TicketEntry> {
        throwIfNotDefined(ticketBodyCreate, 'ticketBodyCreate');

        return this.post({
            path: '/tickets',
            bodyParam: ticketBodyCreate,
            returnType: TicketEntry
        });
    }

    /**
     * Get ticket (login)
     * @returns Promise<TicketEntry>
     */
    getTicket(): Promise<TicketEntry> {
        return this.get({
            path: '/tickets/-me-',
            returnType: TicketEntry
        });
    }

    /**
     * Delete ticket (logout)
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     * @returns Promise<{}>
     */
    deleteTicket(): Promise<void> {
        return this.delete({
            path: '/tickets/-me-'
        });
    }

    /**
     * Validate ticket
     *
     * **Note:** this endpoint is available in Alfresco 5.2 and newer versions.
     *
     * Validates the specified ticket (derived from Authorization header) is still valid.
     * For example, you can pass the Authorization request header using Javascript:
     * Javascript
     * request.setRequestHeader (\"Authorization\", \"Basic \" + btoa(ticket));
     * @returns Promise<ValidTicketEntry>
     */
    validateTicket(): Promise<ValidTicketEntry> {
        return this.get({
            path: '/tickets/-me-',
            returnType: ValidTicketEntry
        });
    }
}
