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

import { ValidationParams } from 'angular-oauth2-oidc';
import { WebCryptoJwksValidationHandler } from './web-crypto-jwks-validation-handler';

/**
 * Encodes data to base64url format
 *
 * @param data - input data as ArrayBuffer or string
 * @returns base64url encoded string
 */
function base64UrlEncode(data: ArrayBuffer | string): string {
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
    let binary = '';
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

interface JwksKey extends JsonWebKey {
    kid?: string;
    use?: string;
}

interface TestKeyPair {
    privateKey: CryptoKey;
    publicJwk: JwksKey;
}

/**
 * Generates an RSA key pair for testing
 *
 * @param kid - optional key ID to assign
 * @returns test key pair with private key and public JWK
 */
async function generateRsaKeyPair(kid?: string): Promise<TestKeyPair> {
    const keyPair = await crypto.subtle.generateKey(
        { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true,
        ['sign', 'verify']
    );
    const publicJwk: JwksKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    publicJwk.use = 'sig';
    if (kid) {
        publicJwk.kid = kid;
    }
    return { privateKey: keyPair.privateKey, publicJwk };
}

/**
 * Generates an EC key pair for testing
 *
 * @param namedCurve - elliptic curve name (e.g. P-256)
 * @param kid - optional key ID to assign
 * @returns test key pair with private key and public JWK
 */
async function generateEcKeyPair(namedCurve: string, kid?: string): Promise<TestKeyPair> {
    const keyPair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve }, true, ['sign', 'verify']);
    const publicJwk: JwksKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    publicJwk.use = 'sig';
    if (kid) {
        publicJwk.kid = kid;
    }
    return { privateKey: keyPair.privateKey, publicJwk };
}

/**
 * Creates a signed JWT for testing
 *
 * @param header - JWT header object
 * @param payload - JWT payload object
 * @param privateKey - key to sign with
 * @param algorithm - signing algorithm parameters
 * @returns signed JWT string
 */
async function createSignedJwt(
    header: object,
    payload: object,
    privateKey: CryptoKey,
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams
): Promise<string> {
    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(JSON.stringify(payload));
    const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = await crypto.subtle.sign(algorithm, privateKey, signingInput);
    const signatureB64 = base64UrlEncode(signature);
    return `${headerB64}.${payloadB64}.${signatureB64}`;
}

/**
 * Builds a ValidationParams object with defaults for testing
 *
 * @param overrides - partial params to override defaults
 * @returns complete ValidationParams
 */
function buildValidationParams(overrides: Partial<ValidationParams>): ValidationParams {
    return {
        idToken: '',
        accessToken: '',
        idTokenHeader: {},
        idTokenClaims: {},
        jwks: {},
        loadKeys: undefined,
        ...overrides
    } as ValidationParams;
}

describe('WebCryptoJwksValidationHandler', () => {
    let handler: WebCryptoJwksValidationHandler;

    beforeEach(() => {
        handler = new WebCryptoJwksValidationHandler();
    });

    describe('parameter validation', () => {
        it('should reject when idToken is missing', async () => {
            const params = buildValidationParams({ idToken: '' });
            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError('Parameter idToken expected!');
        });

        it('should reject when token has less than 3 parts', async () => {
            const params = buildValidationParams({ idToken: 'part1.part2' });
            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError(
                'Invalid JWT format: token must have exactly 3 non-empty parts separated by dots.'
            );
        });

        it('should reject when token has more than 3 parts', async () => {
            const params = buildValidationParams({ idToken: 'a.b.c.d' });
            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError(
                'Invalid JWT format: token must have exactly 3 non-empty parts separated by dots.'
            );
        });

        it('should reject when token has empty parts', async () => {
            const params = buildValidationParams({ idToken: 'a..c' });
            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError(
                'Invalid JWT format: token must have exactly 3 non-empty parts separated by dots.'
            );
        });

        it('should reject when idTokenHeader is missing', async () => {
            const params = buildValidationParams({ idToken: 'a.b.c', idTokenHeader: null });
            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError('Parameter idTokenHeader expected.');
        });

        it('should reject when jwks is missing', async () => {
            const params = buildValidationParams({ idToken: 'a.b.c', idTokenHeader: { alg: 'RS256' }, jwks: null });
            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError('Parameter jwks expected!');
        });

        it('should reject when jwks keys array is empty', async () => {
            const params = buildValidationParams({ idToken: 'a.b.c', idTokenHeader: { alg: 'RS256' }, jwks: { keys: [] } });
            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError('Array keys in jwks missing!');
        });

        it('should reject when algorithm is not supported', async () => {
            const { publicJwk } = await generateRsaKeyPair('test-kid');
            const params = buildValidationParams({
                idToken: 'a.b.c',
                idTokenHeader: { alg: 'none', kid: 'test-kid' },
                jwks: { keys: [publicJwk] }
            });
            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError('Algorithm not supported: none');
        });
    });

    describe('key selection by kid', () => {
        it('should select the key matching the kid in the token header', async () => {
            const key1 = await generateRsaKeyPair('key-1');
            const key2 = await generateRsaKeyPair('key-2');

            const header = { alg: 'RS256', kid: 'key-2' };
            const payload = { sub: '123' };
            const idToken = await createSignedJwt(header, payload, key2.privateKey, { name: 'RSASSA-PKCS1-v1_5' });

            const params = buildValidationParams({
                idToken,
                idTokenHeader: header,
                jwks: { keys: [key1.publicJwk, key2.publicJwk] }
            });

            await expectAsync(handler.validateSignature(params)).toBeResolved();
        });

        it('should reject when kid does not match any key after retry', async () => {
            const key1 = await generateRsaKeyPair('key-1');

            const params = buildValidationParams({
                idToken: 'a.b.c',
                idTokenHeader: { alg: 'RS256', kid: 'unknown-kid' },
                jwks: { keys: [key1.publicJwk] },
                loadKeys: () => Promise.resolve({ keys: [key1.publicJwk] })
            });

            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError(/expected key not found in property jwks/);
        });
    });

    describe('key selection without kid', () => {
        it('should select the single matching key by kty and use', async () => {
            const rsaKey = await generateRsaKeyPair();
            const header = { alg: 'RS256' };
            const payload = { sub: '456' };
            const idToken = await createSignedJwt(header, payload, rsaKey.privateKey, { name: 'RSASSA-PKCS1-v1_5' });

            const params = buildValidationParams({
                idToken,
                idTokenHeader: header,
                jwks: { keys: [rsaKey.publicJwk] }
            });

            await expectAsync(handler.validateSignature(params)).toBeResolved();
        });

        it('should reject when multiple keys match without kid', async () => {
            const key1 = await generateRsaKeyPair();
            const key2 = await generateRsaKeyPair();

            const params = buildValidationParams({
                idToken: 'a.b.c',
                idTokenHeader: { alg: 'RS256' },
                jwks: { keys: [key1.publicJwk, key2.publicJwk] }
            });

            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError(
                'More than one matching key found. Please specify a kid in the id_token header.'
            );
        });

        it('should reject when no key matches after retry', async () => {
            const ecKey = await generateEcKeyPair('P-256');

            const params = buildValidationParams({
                idToken: 'a.b.c',
                idTokenHeader: { alg: 'RS256' },
                jwks: { keys: [ecKey.publicJwk] },
                loadKeys: () => Promise.resolve({ keys: [ecKey.publicJwk] })
            });

            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError('No matching key found.');
        });
    });

    describe('loadKeys retry', () => {
        it('should call loadKeys and retry when key is not found on first attempt', async () => {
            const rsaKey = await generateRsaKeyPair('delayed-key');
            const header = { alg: 'RS256', kid: 'delayed-key' };
            const payload = { sub: '789' };
            const idToken = await createSignedJwt(header, payload, rsaKey.privateKey, { name: 'RSASSA-PKCS1-v1_5' });

            const otherKey = await generateRsaKeyPair('other-key');
            const emptyJwks = { keys: [otherKey.publicJwk] };
            const loadedJwks = { keys: [rsaKey.publicJwk] };
            const loadKeysSpy = jasmine.createSpy('loadKeys').and.returnValue(Promise.resolve(loadedJwks));

            const params = buildValidationParams({
                idToken,
                idTokenHeader: header,
                jwks: emptyJwks,
                loadKeys: loadKeysSpy
            });

            await expectAsync(handler.validateSignature(params)).toBeResolved();
            expect(loadKeysSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('RS256 signature verification', () => {
        it('should resolve for a valid RS256 signature', async () => {
            const rsaKey = await generateRsaKeyPair('rsa-kid');
            const header = { alg: 'RS256', kid: 'rsa-kid' };
            const payload = { sub: 'user1', iat: Math.floor(Date.now() / 1000) };
            const idToken = await createSignedJwt(header, payload, rsaKey.privateKey, { name: 'RSASSA-PKCS1-v1_5' });

            const params = buildValidationParams({
                idToken,
                idTokenHeader: header,
                jwks: { keys: [rsaKey.publicJwk] }
            });

            await expectAsync(handler.validateSignature(params)).toBeResolved();
        });

        it('should reject for a tampered RS256 token', async () => {
            const rsaKey = await generateRsaKeyPair('rsa-kid');
            const header = { alg: 'RS256', kid: 'rsa-kid' };
            const payload = { sub: 'user1' };
            const idToken = await createSignedJwt(header, payload, rsaKey.privateKey, { name: 'RSASSA-PKCS1-v1_5' });

            const parts = idToken.split('.');
            const tamperedPayload = base64UrlEncode(JSON.stringify({ sub: 'attacker' }));
            const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

            const params = buildValidationParams({
                idToken: tamperedToken,
                idTokenHeader: header,
                jwks: { keys: [rsaKey.publicJwk] }
            });

            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError('Signature not valid');
        });

        it('should reject when signed with a different key', async () => {
            const signingKey = await generateRsaKeyPair('signing-key');
            const verifyKey = await generateRsaKeyPair('verify-key');
            const header = { alg: 'RS256', kid: 'verify-key' };
            const payload = { sub: 'user1' };
            const idToken = await createSignedJwt(header, payload, signingKey.privateKey, { name: 'RSASSA-PKCS1-v1_5' });

            const params = buildValidationParams({
                idToken,
                idTokenHeader: header,
                jwks: { keys: [verifyKey.publicJwk] }
            });

            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError('Signature not valid');
        });
    });

    describe('ES256 signature verification', () => {
        it('should resolve for a valid ES256 signature', async () => {
            const ecKey = await generateEcKeyPair('P-256', 'ec-kid');
            const header = { alg: 'ES256', kid: 'ec-kid' };
            const payload = { sub: 'user2' };
            const idToken = await createSignedJwt(header, payload, ecKey.privateKey, { name: 'ECDSA', hash: 'SHA-256' });

            const params = buildValidationParams({
                idToken,
                idTokenHeader: header,
                jwks: { keys: [ecKey.publicJwk] }
            });

            await expectAsync(handler.validateSignature(params)).toBeResolved();
        });

        it('should reject for a tampered ES256 token', async () => {
            const ecKey = await generateEcKeyPair('P-256', 'ec-kid');
            const header = { alg: 'ES256', kid: 'ec-kid' };
            const payload = { sub: 'user2' };
            const idToken = await createSignedJwt(header, payload, ecKey.privateKey, { name: 'ECDSA', hash: 'SHA-256' });

            const parts = idToken.split('.');
            const tamperedPayload = base64UrlEncode(JSON.stringify({ sub: 'attacker' }));
            const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

            const params = buildValidationParams({
                idToken: tamperedToken,
                idTokenHeader: header,
                jwks: { keys: [ecKey.publicJwk] }
            });

            await expectAsync(handler.validateSignature(params)).toBeRejectedWithError('Signature not valid');
        });
    });

    describe('PS256 signature verification', () => {
        it('should resolve for a valid PS256 signature', async () => {
            const keyPair = await crypto.subtle.generateKey(
                { name: 'RSA-PSS', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
                true,
                ['sign', 'verify']
            );
            const publicJwk: JwksKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
            publicJwk.use = 'sig';
            publicJwk.kid = 'ps-kid';

            const header = { alg: 'PS256', kid: 'ps-kid' };
            const payload = { sub: 'user3' };
            const idToken = await createSignedJwt(header, payload, keyPair.privateKey, { name: 'RSA-PSS', saltLength: 32 });

            const params = buildValidationParams({
                idToken,
                idTokenHeader: header,
                jwks: { keys: [publicJwk] }
            });

            await expectAsync(handler.validateSignature(params)).toBeResolved();
        });
    });
});
