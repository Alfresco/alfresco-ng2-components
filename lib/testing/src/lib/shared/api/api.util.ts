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

export type ApiResultPredicate<T> = (result: T) => boolean;
export type ApiCall<T> = () => Promise<T>;

export class ApiUtil {
    static async waitForApi<T>(apiCall: ApiCall<T>, predicate: ApiResultPredicate<T>, retry: number = 30, delay: number = 1000) {
        const apiCallWithPredicateChecking = async () => {
            const apiCallResult = await apiCall();
            if (predicate(apiCallResult)) {
                return Promise.resolve(apiCallResult);
            } else {
                return Promise.reject(apiCallResult);
            }
        };

        return ApiUtil.retryCall(apiCallWithPredicateChecking, retry, delay);
    }

    static retryCall(fn: () => Promise<any>, retry: number = 30, delay: number = 1000): Promise<any> {
        const pause = duration => new Promise(res => setTimeout(res, duration));
        const run = retries => fn().catch(err => (retries > 1 ? pause(delay).then(() => run(retries - 1)) : Promise.reject(err)));

        return run(retry);
    }
}
