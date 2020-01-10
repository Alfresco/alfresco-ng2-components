/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

export class UtilApi {
  static async waitForApi<T>(apiCall: ApiCall<T>, predicate: ApiResultPredicate<T>) {
    const apiCallWithPredicateChecking = async () => {
      const apiCallResult = await apiCall();
      if (predicate(apiCallResult)) {
        return Promise.resolve(apiCallResult);
      } else {
        return Promise.reject(apiCallResult);
      }
    };

    return UtilApi.retryCall(apiCallWithPredicateChecking);
  }

  static retryCall(fn: () => Promise<any>, retry: number = 30, delay: number = 1000): Promise<any> {
    const pause = (duration: number) => new Promise((res) => setTimeout(res, duration));

    const run = (retries: number) => {
      return fn().catch((err) => (retries > 1 ? pause(delay).then(() => run(retries - 1)) : Promise.reject(err)));
    };

    return run(retry);
  }
}
