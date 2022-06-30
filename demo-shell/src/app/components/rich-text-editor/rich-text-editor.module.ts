import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { ContentModule } from '@alfresco/adf-content-services';
import { CoreModule } from '@alfresco/adf-core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: RichTextEditorComponent
    }
];

@NgModule({
    declarations: [RichTextEditorComponent],
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(routes),
        ContentModule.forChild()
    ]
})
export class AppRichTextEditorModule { }
