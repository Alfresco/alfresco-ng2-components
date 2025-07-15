/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { InjectionToken, Provider, Type } from '@angular/core';

export const LANDING_PAGE_TOKEN = new InjectionToken<Type<any>>('LANDING_PAGE_TOKEN');

export function provideLandingPage(componentClass: Type<any>): Provider {
    return {
        provide: LANDING_PAGE_TOKEN,
        useValue: componentClass,
    };
}
