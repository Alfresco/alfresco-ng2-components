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

import { PathMatcher } from '../src/utils/path-matcher';
import { expect } from 'chai';

describe('PathMatcher', () => {
    describe('match', () => {
        it('should return true if path is exactly the same like pattern', () => {
            expect(PathMatcher.match('public-url', 'public-url')).be.true;
        });

        it('should return false if path is not equal to pattern', () => {
            expect(PathMatcher.match('some-public-url', 'public-url')).be.false;
        });

        it('should return true if absolute path is equal to absolute path', () => {
            expect(PathMatcher.match('http://some-public-url', 'http://some-public-url')).be.true;
        });

        it('should return true if path matches pattern containing double and single *', () => {
            expect(PathMatcher.match('http://some-public-url/123/path', '**/some-public-url/*/path')).be.true;
        });

        it('should return true if path matches to pattern after replacing ** with multiple parts at the beginning', () => {
            expect(PathMatcher.match('http://test/other-test/some-public-url/path', '**/some-public-url/path')).be.true;
        });

        it('should return true if path matches to pattern after replacing ** with multiple parts at the beginning', () => {
            expect(PathMatcher.match('http://test/other-test/some-public-url/path', '**/some-public-url/path')).be.true;
        });

        it('should return true if path matches to pattern after replacing ** with multiple parts at the end', () => {
            expect(PathMatcher.match('http://some-public-url/path/test/other-test', 'http://some-public-url/path/**')).be.true;
        });

        it('should return true if path matches to pattern after replacing ** with none parts at the end', () => {
            expect(PathMatcher.match('http://some-public-url/path/', 'http://some-public-url/path/**')).be.true;
        });

        it('should return false if path does not match to pattern after replacing ** with none parts at the end and cuts last /', () => {
            expect(PathMatcher.match('http://some-public-url/path', 'http://some-public-url/path/**')).be.false;
        });

        it('should return true if path matches to pattern after replacing ** with multiple parts in the middle', () => {
            expect(PathMatcher.match('http://some-public-url/test/other-test/path', 'http://some-public-url/**/path')).be.true;
        });

        it('should return true if path matches to pattern after replacing ** with none parts in the middle', () => {
            expect(PathMatcher.match('http://some-public-url/path', 'http://some-public-url/**/path')).be.true;
        });

        it('should return false if path does not match to pattern with **', () => {
            expect(PathMatcher.match('http://some-public-url/', 'http://some-public-url/**/path')).be.false;
        });

        it('should return false if path has more than one part as replacement for * in the middle of pattern', () => {
            expect(PathMatcher.match('http://some-public-url/123/test/path', 'http://some-public-url/*/path')).be.false;
        });

        it('should return false if path has zero parts as replacement for * in the middle of pattern', () => {
            expect(PathMatcher.match('http://some-public-url/path', 'http://some-public-url/*/path')).be.false;
        });

        it('should return true if path matches to pattern containing * at the end', () => {
            expect(PathMatcher.match('http://some-public-url/path/test', 'http://some-public-url/path/*')).be.true;
        });

        it('should return false if path matches to pattern containing * at the end and cuts last /', () => {
            expect(PathMatcher.match('http://some-public-url/path', 'http://some-public-url/path/*')).be.false;
        });

        it('should return false if path has more than one part as replacement for * at the end of pattern', () => {
            expect(PathMatcher.match('http://some-public-url/path/test/other-test', 'http://some-public-url/path/*')).be.false;
        });

        it('should return false if path has zero parts as replacement for * at the end of pattern', () => {
            expect(PathMatcher.match('http://some-public-url/path/test/other-test', 'http://some-public-url/path/*')).be.false;
        });

        it('should return false if path starts with http:// and * is at the beginning of pattern', () => {
            expect(PathMatcher.match('http://some-public-url/path/test', '*/some-public-url/path')).be.false;
        });
    });
});
