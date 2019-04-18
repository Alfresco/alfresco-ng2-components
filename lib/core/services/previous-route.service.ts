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

import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PreviousRouteService {

    private previousUrl: string;
    private currentUrl: string;

    constructor(private router: Router,
                private location: Location) {
        this.currentUrl = this.router.url;
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
            }
        });
    }

    public getPreviousUrl(): string {
        return this.previousUrl;
    }

    public goBackToPreviousPage(): void {
        if (this.previousUrl && this.previousUrl.includes('login') || window.history.length <= 2) {
            this.goBackToHome();
        } else {
            this.location.back();
        }
    }

    public goBackToHome(): void {
        this.router.navigate([{outlets: {overlay: null, primary: ['home']}}]);
    }
}
