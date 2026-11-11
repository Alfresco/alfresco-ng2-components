/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

describe('frontchannel-logout.html', () => {
    const pageUrl = '/assets/frontchannel-logout.html';
    const issuer = 'https://idp.example.com/idp';
    const endedSessionId = 'ended-session';
    const modelingPrefix = 'FCL_TEST_MODELING_';
    const adminPrefix = 'FCL_TEST_ADMIN_';
    const otherSessionPrefix = 'FCL_TEST_OTHER_SESSION_';
    const otherIssuerPrefix = 'FCL_TEST_OTHER_ISSUER_';
    const brokenTokenPrefix = 'FCL_TEST_BROKEN_';
    const itemWatchedByAuthGuardWhichReloadsThePageWhenRemoved = 'access_token';
    const authItems = [
        'access_token',
        'access_token_stored_at',
        'expires_at',
        'granted_scopes',
        'id_token',
        'id_token_claims_obj',
        'id_token_expires_at',
        'id_token_stored_at',
        'nonce',
        'PKCE_verifier',
        'refresh_token',
        'session_state'
    ].filter((item) => item !== itemWatchedByAuthGuardWhichReloadsThePageWhenRemoved);

    let iframe: HTMLIFrameElement | undefined;

    const toBase64Url = (value: string) =>
        btoa(String.fromCharCode(...new TextEncoder().encode(value)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

    const createIdToken = (claims: Record<string, string>) => `header.${toBase64Url(JSON.stringify(claims))}.signature`;

    const storeApplicationTokens = (prefix: string, idToken: string) => {
        authItems.forEach((item) => localStorage.setItem(prefix + item, 'fake-value'));
        localStorage.setItem(prefix + 'id_token', idToken);
        localStorage.setItem(prefix + 'user_preference', 'not-an-auth-item');
    };

    const storedAuthItems = (prefix: string) => authItems.filter((item) => localStorage.getItem(prefix + item) !== null);

    const loadPage = async (query: string) => {
        iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        const loaded = new Promise((resolve) => iframe?.addEventListener('load', resolve, { once: true }));
        iframe.src = pageUrl + query;
        document.body.appendChild(iframe);
        await loaded;
    };

    const removeTestItems = () =>
        Object.keys(localStorage)
            .filter((key) => key.startsWith('FCL_TEST_'))
            .forEach((key) => localStorage.removeItem(key));

    beforeEach(() => {
        removeTestItems();
        storeApplicationTokens(modelingPrefix, createIdToken({ iss: issuer, sid: endedSessionId, name: 'Zoë' }));
        storeApplicationTokens(adminPrefix, createIdToken({ iss: `${issuer}/`, sid: endedSessionId }));
        storeApplicationTokens(otherSessionPrefix, createIdToken({ iss: issuer, sid: 'another-session' }));
        storeApplicationTokens(otherIssuerPrefix, createIdToken({ iss: 'https://another-idp.example.com', sid: endedSessionId }));
        storeApplicationTokens(brokenTokenPrefix, 'not-a-jwt');
    });

    afterEach(() => {
        iframe?.remove();
        removeTestItems();
    });

    it('should remove the auth items of every application logged in with the ended session', async () => {
        await loadPage(`?iss=${encodeURIComponent(issuer)}&sid=${endedSessionId}`);

        expect(storedAuthItems(modelingPrefix)).toEqual([]);
        expect(storedAuthItems(adminPrefix)).toEqual([]);
    });

    it('should keep the items that are not auth items', async () => {
        await loadPage(`?iss=${encodeURIComponent(issuer)}&sid=${endedSessionId}`);

        expect(localStorage.getItem(modelingPrefix + 'user_preference')).toBe('not-an-auth-item');
    });

    it('should keep the auth items of applications logged in with another session or another issuer', async () => {
        await loadPage(`?iss=${encodeURIComponent(issuer)}&sid=${endedSessionId}`);

        expect(storedAuthItems(otherSessionPrefix)).toEqual(authItems);
        expect(storedAuthItems(otherIssuerPrefix)).toEqual(authItems);
        expect(storedAuthItems(brokenTokenPrefix)).toEqual(authItems);
    });

    it('should remove nothing when the session id does not match', async () => {
        await loadPage(`?iss=${encodeURIComponent(issuer)}&sid=unknown-session`);

        expect(storedAuthItems(modelingPrefix)).toEqual(authItems);
        expect(storedAuthItems(adminPrefix)).toEqual(authItems);
    });

    ['', `?iss=${encodeURIComponent(issuer)}`, `?sid=${endedSessionId}`].forEach((query) => {
        it(`should remove nothing when the issuer or the session id is missing: "${query}"`, async () => {
            await loadPage(query);

            expect(storedAuthItems(modelingPrefix)).toEqual(authItems);
            expect(storedAuthItems(adminPrefix)).toEqual(authItems);
        });
    });
});
