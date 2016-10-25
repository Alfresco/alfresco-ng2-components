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

import { Injectable } from '@angular/core';

@Injectable()
export class RaphaelService {

    paper: any;
    width: number = 300;
    height: number = 400 ;
    private ctx: any;

    constructor() {
    }

    public getInstance(element: any): any {
        if (!this.paper) {
            this.ctx = element.nativeElement;
            this.refresh();
        }
        return this.paper;
    }

    private refresh(): any {
        this.ngOnDestroy();
        this.paper = this.getPaperBuilder(this.ctx);
    }

    public getPaperBuilder(ctx: any): any {
        if (typeof Raphael === 'undefined') {
            throw new Error('ng2-charts configuration issue: Embedding Chart.js lib is mandatory');
        }
        let paper = new Raphael(ctx, this.width, this.height);
        // paper.setViewBox(0, 0, 583, 344.08374193550003, false);
        // paper.renderfix();
        return paper;
    }

    private ngOnDestroy(): any {
        if (this.paper) {
            this.paper.clear();
            this.paper = void 0;
        }
    }

    public setting(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public reset(): any {
        this.ngOnDestroy();
    }
}
