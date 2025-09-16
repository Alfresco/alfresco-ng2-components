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
import { EcmAuthMock, UploadMock } from './mockObjects';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UploadApi, AlfrescoApi } from '../src';

describe('Upload', () => {
    let authResponseMock: EcmAuthMock;
    let uploadMock: UploadMock;
    let alfrescoJsApi: AlfrescoApi;
    let uploadApi: UploadApi;

    const createTestFileStream = (fileName: string) => createReadStream(join(__dirname, 'mockObjects/assets', fileName));

    beforeEach(async () => {
        const hostEcm = 'https://127.0.0.1:8080';

        authResponseMock = new EcmAuthMock(hostEcm);
        uploadMock = new UploadMock(hostEcm);

        authResponseMock.get201Response();
        alfrescoJsApi = new AlfrescoApi({
            hostEcm
        });

        uploadApi = new UploadApi(alfrescoJsApi);

        await alfrescoJsApi.login('admin', 'admin');
    });

    describe('Upload File', () => {
        it('upload file should return 200 if is all ok', async () => {
            uploadMock.get201CreationFile();

            const file = createTestFileStream('testFile.txt');

            const data = await uploadApi.uploadFile(file);
            assert.equal(data.entry.isFile, true);
            assert.equal(data.entry.name, 'testFile.txt');
        });

        it('upload file should get 409 if new name clashes with an existing file in the current parent folder', async () => {
            uploadMock.get409CreationFileNewNameClashes();

            const file = createTestFileStream('testFile.txt');
            try {
                await uploadApi.uploadFile(file);
                assert.fail('Expected an error to be thrown');
            } catch (error) {
                assert.equal(error.status, 409);
            }
        });

        it('upload file should get 200 and rename if the new name clashes with an existing file in the current parent folder and autorename is true', async () => {
            uploadMock.get201CreationFileAutoRename();

            const file = createTestFileStream('testFile.txt');

            const data = await uploadApi.uploadFile(file, null, null, null, { autoRename: true });

            assert.equal(data.entry.isFile, true);
            assert.equal(data.entry.name, 'testFile-2.txt');
        });

        it('Abort should stop the  file file upload', (done) => {
            const file = createTestFileStream('testFile.txt');

            const promise: any = uploadApi.uploadFile(file, null, null, null, { autoRename: true });
            promise.once('abort', () => {
                done();
            });

            promise.abort();
        });
    });

    describe('Events', () => {
        it('Upload should fire done event at the end of an upload', (done) => {
            uploadMock.get201CreationFile();

            const file = createTestFileStream('testFile.txt');

            const uploadPromise: any = uploadApi.uploadFile(file);

            uploadPromise.catch(() => {});
            uploadPromise.on('success', () => {
                done();
            });
        });

        it('Upload should fire error event if something go wrong', (done) => {
            uploadMock.get409CreationFileNewNameClashes();

            const file = createTestFileStream('testFile.txt');

            const uploadPromise: any = uploadApi.uploadFile(file);
            uploadPromise.catch(() => {});
            uploadPromise.on('error', () => {
                done();
            });
        });

        it('Upload should fire unauthorized event if get 401', (done) => {
            uploadMock.get401Response();

            const file = createTestFileStream('testFile.txt');

            const uploadPromise: any = uploadApi.uploadFile(file);

            uploadPromise.catch(() => {});
            uploadPromise.on('unauthorized', () => {
                done();
            });
        });

        it('Upload should fire progress event during the upload', (done) => {
            uploadMock.get201CreationFile();

            const file = createTestFileStream('testFile.txt');
            const uploadPromise: any = uploadApi.uploadFile(file);

            uploadPromise.once('progress', () => done());
        });

        it('Multiple Upload should fire progress events on the right promise during the upload', (done) => {
            const file = createTestFileStream('testFile.txt');
            const fileTwo = createTestFileStream('testFile2.txt');

            let progressOneOk = false;
            let progressTwoOk = false;

            const promiseProgressOne = new Promise((resolve) => {
                uploadMock.get201CreationFile();

                const promise: any = uploadApi.uploadFile(file);
                promise.once('success', () => {
                    progressOneOk = true;
                    resolve('Resolving');
                });
            });

            const promiseProgressTwo = new Promise((resolve) => {
                uploadMock.get201CreationFile();

                const promise: any = uploadApi.uploadFile(fileTwo);
                promise.once('success', () => {
                    progressTwoOk = true;
                    resolve('Resolving');
                });
            });

            Promise.all([promiseProgressOne, promiseProgressTwo]).then(() => {
                assert.equal(progressOneOk, true);
                assert.equal(progressTwoOk, true);
                done();
            });
        });

        it('Multiple Upload should fire error events on the right promise during the upload', (done) => {
            const file = createTestFileStream('testFile.txt');
            const fileTwo = createTestFileStream('testFile2.txt');

            let errorOneOk = false;
            let errorTwoOk = false;

            const promiseErrorOne = new Promise((resolve) => {
                uploadMock.get201CreationFile();

                const uploadPromise: any = uploadApi.uploadFile(file);
                uploadPromise.catch(() => {});
                uploadPromise.once('success', () => {
                    errorOneOk = true;
                    resolve('Resolving');
                });
            });

            const promiseErrorTwo = new Promise((resolve) => {
                uploadMock.get201CreationFile();

                const uploadPromise: any = uploadApi.uploadFile(fileTwo);
                uploadPromise.catch(() => {});
                uploadPromise.once('success', () => {
                    errorTwoOk = true;
                    resolve('Resolving');
                });
            });

            Promise.all([promiseErrorOne, promiseErrorTwo]).then(() => {
                assert.equal(errorOneOk, true);
                assert.equal(errorTwoOk, true);
                done();
            });
        });

        it('Multiple Upload should fire success events on the right promise during the upload', (done) => {
            const file = createTestFileStream('testFile.txt');
            const fileTwo = createTestFileStream('testFile2.txt');

            let successOneOk = false;
            let successTwoOk = false;

            const promiseSuccessOne = new Promise((resolve) => {
                uploadMock.get201CreationFile();

                const uploadPromiseOne: any = uploadApi.uploadFile(file);
                uploadPromiseOne.catch(() => {});
                uploadPromiseOne.once('success', () => {
                    successOneOk = true;
                    resolve('Resolving');
                });
            });

            const promiseSuccessTwo = new Promise((resolve) => {
                uploadMock.get201CreationFile();

                const uploadPromiseTwo: any = uploadApi.uploadFile(fileTwo);
                uploadPromiseTwo.catch(() => {});
                uploadPromiseTwo.once('success', () => {
                    successTwoOk = true;
                    resolve('Resolving');
                });
            });

            Promise.all([promiseSuccessOne, promiseSuccessTwo]).then(() => {
                assert.equal(successOneOk, true);
                assert.equal(successTwoOk, true);
                done();
            });
        });

        it('Multiple Upload should resolve the correct promise', (done) => {
            const file = createTestFileStream('testFile.txt');
            const fileTwo = createTestFileStream('testFile2.txt');

            let resolveOneOk = false;
            let resolveTwoOk = false;

            uploadMock.get201CreationFile();

            const p1 = uploadApi.uploadFile(file).then(() => {
                resolveOneOk = true;
            });

            uploadMock.get201CreationFile();

            const p2 = uploadApi.uploadFile(fileTwo).then(() => {
                resolveTwoOk = true;
            });

            Promise.all([p1, p2]).then(() => {
                assert.equal(resolveOneOk, true);
                assert.equal(resolveTwoOk, true);
                done();
            });
        });

        it('Multiple Upload should reject the correct promise', (done) => {
            const file = createTestFileStream('testFile.txt');
            const fileTwo = createTestFileStream('testFile2.txt');

            let rejectOneOk = false;
            let rejectTwoOk = false;

            uploadMock.get409CreationFileNewNameClashes();

            const p1 = uploadApi.uploadFile(file).then(null, () => {
                rejectOneOk = true;
            });

            uploadMock.get409CreationFileNewNameClashes();

            const p2 = uploadApi.uploadFile(fileTwo).then(null, () => {
                rejectTwoOk = true;
            });

            Promise.all([p1, p2]).then(() => {
                assert.equal(rejectOneOk, true);
                assert.equal(rejectTwoOk, true);
                done();
            });
        });

        it('Is possible use chain events', (done) => {
            const file = createTestFileStream('testFile.txt');

            uploadMock.get401Response();

            let promiseProgressOne = {};
            let promiseProgressTwo = {};

            const uploadPromise: any = uploadApi.uploadFile(file);
            uploadPromise.catch(() => {});

            uploadPromise
                .once('error', () => {
                    promiseProgressOne = Promise.resolve('Resolving');
                })
                .once('unauthorized', () => {
                    promiseProgressTwo = Promise.resolve('Resolving');
                });

            Promise.all([promiseProgressOne, promiseProgressTwo]).then(() => {
                done();
            });
        });
    });
});
