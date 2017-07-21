import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';

import { PaginationComponent } from './pagination.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        MaterialModule
    ],
    declarations: [
        PaginationComponent
    ],
    exports: [
        PaginationComponent
    ]
})
export class PaginationModule {}
