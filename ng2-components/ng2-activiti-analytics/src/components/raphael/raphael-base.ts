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

import {
    OnDestroy,
    OnInit,
    Input,
    ElementRef
} from '@angular/core';

declare let Raphael: any;

export class RaphaelBase implements OnDestroy, OnInit {
    @Input()
    paper: any;

    private ctx: any;

    private initFlag: boolean = false;

    private element: ElementRef;

    public constructor(element: ElementRef) {
        this.element = element;
    }

    public ngOnInit(): any {
        if (!this.paper) {
            this.ctx = this.element.nativeElement;
            this.initFlag = true;
            this.refresh();
        }
    }

    public ngOnDestroy(): any {
        if (this.paper) {
            this.paper.clear();
            this.paper = void 0;
        }
    }

    public getPaperBuilder(ctx: any): any {
        if (typeof Raphael === 'undefined') {
            throw new Error('ng2-charts configuration issue: Embedding Chart.js lib is mandatory');
        }
        let paper = new Raphael(ctx, 583, 344.08374193550003);
        paper.setViewBox(0, 0, 583, 344.08374193550003, false);
        paper.renderfix();
        return paper;
    }

    private refresh(): any {
        this.ngOnDestroy();
        this.paper = this.getPaperBuilder(this.ctx);
    }
}
