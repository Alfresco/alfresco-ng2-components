/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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


export class PDFViewermock {

    currentPageNumber: number = 1;

    currentPage = {
        renderingState: 3 as number
    };

    _pages: any =
        [{
            width: 793,
            scale: 1,
            update: this.update,
            div: {
                offsetTop: 400
            },
            viewport: {
                height: 400
            }
        }, {
            width: 793,
            scale: 1,
            update: this.update,
            div: {
                offsetTop: 800
            },
            viewport: {
                height: 400
            }
        }, {
            width: 793,
            scale: 1,
            update: this.update,
            div: {
                offsetTop: 1200
            },
            viewport: {
                height: 400
            }
        }];

    _currentPageNumber: number = 0;

    update() {
    }
}
