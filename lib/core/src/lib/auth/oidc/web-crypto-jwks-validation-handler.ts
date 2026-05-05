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

import { AbstractValidationHandler, ValidationParams } from 'angular-oauth2-oidc';

export class WebCryptoJwksValidationHandler extends AbstractValidationHandler {
    allowedAlgorithms: string[] = ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'PS256', 'PS384', 'PS512'];

    gracePeriodInSec = 600;

    async validateSignature(params: ValidationParams, retry = false): Promise<any> {
        if (!params.idToken) {
            throw new Error('Parameter idToken expected!');
        }
        if (!params.idTokenHeader) {
            throw new Error('Parameter idTokenHeader expected.');
        }
        if (!params.jwks) {
            throw new Error('Parameter jwks expected!');
        }
        if (!params.jwks['keys'] || !Array.isArray(params.jwks['keys']) || params.jwks['keys'].length === 0) {
            throw new Error('Array keys in jwks missing!');
        }

        const keyId: string = params.idTokenHeader['kid'];
        const jwksKeys: object[] = params.jwks['keys'];
        const algorithm: string = params.idTokenHeader['alg'];

        let matchedKey: any;

        if (keyId) {
            matchedKey = jwksKeys.find((jwk) => jwk['kid'] === keyId);
        } else {
            const keyType = this.algorithmToKeyType(algorithm);
            const matchingKeys = jwksKeys.filter((jwk) => jwk['kty'] === keyType && jwk['use'] === 'sig');

            if (matchingKeys.length > 1) {
                return Promise.reject(new Error('More than one matching key found. Please specify a kid in the id_token header.'));
            } else if (matchingKeys.length === 1) {
                matchedKey = matchingKeys[0];
            }
        }

        if (!matchedKey && !retry && params.loadKeys) {
            const loadedKeys = await params.loadKeys();
            params.jwks = loadedKeys;
            return this.validateSignature(params, true);
        }

        if (!matchedKey && retry && !keyId) {
            return Promise.reject(new Error('No matching key found.'));
        }

        if (!matchedKey && retry && keyId) {
            return Promise.reject(
                new Error(
                    'expected key not found in property jwks. ' +
                        'This property is most likely loaded with the ' +
                        'discovery document. ' +
                        'Expected key id (kid): ' +
                        keyId
                )
            );
        }

        if (!this.allowedAlgorithms.includes(algorithm)) {
            return Promise.reject(new Error('Algorithm not supported: ' + algorithm));
        }

        const cryptoKey = await this.importKey(matchedKey, algorithm);
        const isValid = await this.verifySignature(params.idToken, cryptoKey, algorithm);

        if (isValid) {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('Signature not valid'));
        }
    }

    private async importKey(jsonWebKey: any, algorithmName: string): Promise<CryptoKey> {
        const importAlgorithm = this.getImportAlgorithm(algorithmName);
        return crypto.subtle.importKey('jwk', jsonWebKey, importAlgorithm, false, ['verify']);
    }

    private async verifySignature(idToken: string, cryptoKey: CryptoKey, algorithmName: string): Promise<boolean> {
        const tokenParts = idToken.split('.');
        const headerAndPayload = new TextEncoder().encode(tokenParts[0] + '.' + tokenParts[1]);
        const signature = this.base64UrlDecode(tokenParts[2]);
        const verifyAlgorithm = this.getVerifyAlgorithm(algorithmName);
        return crypto.subtle.verify(verifyAlgorithm, cryptoKey, signature, headerAndPayload);
    }

    private getImportAlgorithm(algorithmName: string): RsaHashedImportParams | EcKeyImportParams {
        switch (algorithmName) {
            case 'RS256':
                return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
            case 'RS384':
                return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384' };
            case 'RS512':
                return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512' };
            case 'ES256':
                return { name: 'ECDSA', namedCurve: 'P-256' };
            case 'ES384':
                return { name: 'ECDSA', namedCurve: 'P-384' };
            case 'PS256':
                return { name: 'RSA-PSS', hash: 'SHA-256' };
            case 'PS384':
                return { name: 'RSA-PSS', hash: 'SHA-384' };
            case 'PS512':
                return { name: 'RSA-PSS', hash: 'SHA-512' };
            default:
                throw new Error('Unsupported algorithm: ' + algorithmName);
        }
    }

    private getVerifyAlgorithm(algorithmName: string): AlgorithmIdentifier | RsaPssParams | EcdsaParams {
        switch (algorithmName) {
            case 'RS256':
            case 'RS384':
            case 'RS512':
                return { name: 'RSASSA-PKCS1-v1_5' };
            case 'ES256':
                return { name: 'ECDSA', hash: 'SHA-256' };
            case 'ES384':
                return { name: 'ECDSA', hash: 'SHA-384' };
            case 'PS256':
                return { name: 'RSA-PSS', saltLength: 32 };
            case 'PS384':
                return { name: 'RSA-PSS', saltLength: 48 };
            case 'PS512':
                return { name: 'RSA-PSS', saltLength: 64 };
            default:
                throw new Error('Unsupported algorithm: ' + algorithmName);
        }
    }

    private base64UrlDecode(input: string): ArrayBuffer {
        let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index++) {
            bytes[index] = binary.charCodeAt(index);
        }
        return bytes.buffer;
    }

    protected async calcHash(valueToHash: string, algorithm: string): Promise<string> {
        const msgBuffer = new TextEncoder().encode(valueToHash);
        const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer);
        const hashArray = new Uint8Array(hashBuffer);
        let result = '';
        for (const byte of hashArray) {
            result += String.fromCharCode(byte);
        }
        return result;
    }

    private algorithmToKeyType(algorithmName: string): string {
        switch (algorithmName.charAt(0)) {
            case 'R':
                return 'RSA';
            case 'E':
                return 'EC';
            case 'P':
                return 'RSA';
            default:
                throw new Error('Cannot infer key type from algorithm: ' + algorithmName);
        }
    }
}
