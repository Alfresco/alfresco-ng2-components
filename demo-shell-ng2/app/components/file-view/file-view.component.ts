import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlfrescoApiService } from 'ng2-alfresco-core';

@Component({
    selector: 'adf-file-view',
    templateUrl: 'file-view.component.html'
})
export class FileViewComponent implements OnInit {

    nodeId: string = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiService: AlfrescoApiService) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params.nodeId;
            if (id) {
                this.apiService.getInstance().nodes.getNodeInfo(id).then(
                    (node) => {
                        if (node && node.isFile) {
                            this.nodeId = id;
                            return;
                        }
                        this.router.navigate(['/files', id]);
                    },
                    () => this.router.navigate(['/files', id])
                );
            }
        });
    }

}
