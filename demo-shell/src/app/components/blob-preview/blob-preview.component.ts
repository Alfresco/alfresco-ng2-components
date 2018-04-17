import { Component } from '@angular/core';
import { PreviewService } from '../../services/preview.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'bob-preview.component.html'
})
export class BlobPreviewComponent {
    content: Blob;
    name: string;

    constructor(preview: PreviewService, router: Router) {
        if (preview.content === null || preview.name === null) {
            router.navigate([{ outlets: { overlay: null } }]);
            return;
        }

        this.content = preview.content;
        this.name = preview.name;
    }
}
