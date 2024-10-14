/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import assert from 'assert';
import { AlfrescoApi, AlfrescoApiClient, DateAlfresco } from '../src';
import { EcmAuthMock } from './mockObjects';

describe('Alfresco Core API Client', () => {
    describe('type conversion', () => {
        it('should return the username after login', (done) => {
            const authResponseEcmMock = new EcmAuthMock('https://127.0.0.1:8080');

            authResponseEcmMock.get201Response();

            const alfrescoJsApi = new AlfrescoApi({
                hostEcm: 'https://127.0.0.1:8080'
            });

            alfrescoJsApi.login('admin', 'admin').then(() => {
                assert.equal(alfrescoJsApi.getEcmUsername(), 'admin');
                done();
            });
        });
    });

    describe('date parsing', () => {
        const equalTime = (actual: Date, expected: Date) => actual.getTime() === expected.getTime();

        it('should convert dates falling in GMT without a timezone', () => {
            assert.equal(equalTime(DateAlfresco.parseDate('2015-11-17T03:33:17'), new Date(Date.UTC(2015, 10, 17, 3, 33, 17))), true);
        });

        it('should convert dates falling in BST without a timezone', () => {
            assert.equal(equalTime(DateAlfresco.parseDate('2015-10-17T03:33:17'), new Date(Date.UTC(2015, 9, 17, 3, 33, 17))), true);
        });

        it('should convert dates with a UTC Zulu-time timezone', () => {
            assert.equal(equalTime(DateAlfresco.parseDate('2015-11-17T03:33:17Z'), new Date(Date.UTC(2015, 10, 17, 3, 33, 17))), true);
        });

        it('should convert dates with a UTC zero-offset timezone', () => {
            assert.equal(equalTime(DateAlfresco.parseDate('2015-11-17T03:33:17+0000'), new Date(Date.UTC(2015, 10, 17, 3, 33, 17))), true);
        });

        it('should convert dates with a positive offset timezone', () => {
            assert.equal(equalTime(DateAlfresco.parseDate('2015-11-17T03:33:17+0200'), new Date(Date.UTC(2015, 10, 17, 1, 33, 17))), true);
        });

        it('should convert dates with a negative offset timezone', () => {
            assert.equal(equalTime(DateAlfresco.parseDate('2015-11-17T03:33:17-0200'), new Date(Date.UTC(2015, 10, 17, 5, 33, 17))), true);
        });

        it('should convert dates with a part-hour offset', () => {
            assert.equal(equalTime(DateAlfresco.parseDate('2015-11-17T03:23:17-0930'), new Date(Date.UTC(2015, 10, 17, 12, 53, 17))), true);
        });

        it('should convert dates with a timezone HH:MM separator', () => {
            assert.equal(equalTime(DateAlfresco.parseDate('2015-11-17T03:33:17+02:00'), new Date(Date.UTC(2015, 10, 17, 1, 33, 17))), true);
        });

        it('should convert dates with a timezone with hours only', () => {
            assert.equal(equalTime(DateAlfresco.parseDate('2015-11-17T03:33:17+02'), new Date(Date.UTC(2015, 10, 17, 1, 33, 17))), true);
        });
    });

    describe('Alfresco Api Client getAlfTicket', () => {
        // Tickets
        const alfTicketParam = '&alf_ticket=';
        const mockArgTicket = 'arg-ticket';
        const mockStorageTicket = 'storage-ticket';
        const mockConfigTicket = 'config-ticket';

        // Create a mock storage
        const storageContent = { 'ticket-ECM': mockStorageTicket };
        const mockStorage = { getItem: (key: string) => storageContent[key] };

        let alfrescoApiClient: AlfrescoApiClient;

        beforeEach(() => {
            // Create an instance of AlfrescoApiClient with storage and config
            alfrescoApiClient = new AlfrescoApiClient();
            alfrescoApiClient.storage = mockStorage as any;
            alfrescoApiClient.config = { ticketEcm: mockConfigTicket };
        });

        it('should return the supplied ticket', () => {
            const ticket = alfrescoApiClient.getAlfTicket(mockArgTicket);
            const expectedResult = alfTicketParam + mockArgTicket;
            assert.equal(ticket, expectedResult);
        });

        it('should return the ticket from storage', () => {
            const ticket = alfrescoApiClient.getAlfTicket(undefined);
            const expectedResult = alfTicketParam + mockStorageTicket;
            assert.equal(ticket, expectedResult);
        });
    });
});
