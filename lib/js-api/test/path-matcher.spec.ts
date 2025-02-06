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

import assert from 'assert';
import { PathMatcher } from '../src/utils/path-matcher';

describe('PathMatcher', () => {
    const pathPatcher = new PathMatcher();

    describe('match', () => {
        it('should return true if path is exactly the same like pattern', () => {
            assert.equal(pathPatcher.match('public-url', 'public-url'), true);
        });

        it('should return false if path is not equal to pattern', () => {
            assert.equal(pathPatcher.match('some-public-url', 'public-url'), false);
        });

        it('should return true if absolute path is equal to absolute path', () => {
            assert.equal(pathPatcher.match('https://some-public-url', 'https://some-public-url'), true);
        });

        it('should return true if path matches pattern containing double and single *', () => {
            assert.equal(pathPatcher.match('https://some-public-url/123/path', '**/some-public-url/*/path'), true);
        });

        it('should return true if path matches to pattern after replacing ** with multiple parts at the beginning', () => {
            assert.equal(pathPatcher.match('https://test/other-test/some-public-url/path', '**/some-public-url/path'), true);
        });

        it('should return true if path matches to pattern after replacing ** with multiple parts at the beginning', () => {
            assert.equal(pathPatcher.match('https://test/other-test/some-public-url/path', '**/some-public-url/path'), true);
        });

        it('should return true if path matches to pattern after replacing ** with multiple parts at the end', () => {
            assert.equal(pathPatcher.match('https://some-public-url/path/test/other-test', 'https://some-public-url/path/**'), true);
        });

        it('should return true if path matches to pattern after replacing ** with none parts at the end', () => {
            assert.equal(pathPatcher.match('https://some-public-url/path/', 'https://some-public-url/path/**'), true);
        });

        it('should return false if path does not match to pattern after replacing ** with none parts at the end and cuts last /', () => {
            assert.equal(pathPatcher.match('https://some-public-url/path', 'https://some-public-url/path/**'), false);
        });

        it('should return true if path matches to pattern after replacing ** with multiple parts in the middle', () => {
            assert.equal(pathPatcher.match('https://some-public-url/test/other-test/path', 'https://some-public-url/**/path'), true);
        });

        it('should return true if path matches to pattern after replacing ** with none parts in the middle', () => {
            assert.equal(pathPatcher.match('https://some-public-url/path', 'https://some-public-url/**/path'), true);
        });

        it('should return false if path does not match to pattern with **', () => {
            assert.equal(pathPatcher.match('https://some-public-url/', 'https://some-public-url/**/path'), false);
        });

        it('should return false if path has more than one part as replacement for * in the middle of pattern', () => {
            assert.equal(pathPatcher.match('https://some-public-url/123/test/path', 'https://some-public-url/*/path'), false);
        });

        it('should return false if path has zero parts as replacement for * in the middle of pattern', () => {
            assert.equal(pathPatcher.match('https://some-public-url/path', 'https://some-public-url/*/path'), false);
        });

        it('should return true if path matches to pattern containing * at the end', () => {
            assert.equal(pathPatcher.match('https://some-public-url/path/test', 'https://some-public-url/path/*'), true);
        });

        it('should return false if path matches to pattern containing * at the end and cuts last /', () => {
            assert.equal(pathPatcher.match('https://some-public-url/path', 'https://some-public-url/path/*'), false);
        });

        it('should return false if path has more than one part as replacement for * at the end of pattern', () => {
            assert.equal(pathPatcher.match('https://some-public-url/path/test/other-test', 'https://some-public-url/path/*'), false);
        });

        it('should return false if path has zero parts as replacement for * at the end of pattern', () => {
            assert.equal(pathPatcher.match('https://some-public-url/path/test/other-test', 'https://some-public-url/path/*'), false);
        });

        it('should return false if path starts with https:// and * is at the beginning of pattern', () => {
            assert.equal(pathPatcher.match('https://some-public-url/path/test', '*/some-public-url/path'), false);
        });
    });
});
