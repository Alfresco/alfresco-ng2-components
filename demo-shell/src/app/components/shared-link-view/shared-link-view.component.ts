import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-shared-link-view',
    templateUrl: 'shared-link-view.component.html',
    styleUrls: [ 'shared-link-view.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line:use-host-property-decorator
    host: { 'class': 'app-shared-link-view' }
})
export class SharedLinkViewComponent implements OnInit {

    sharedLinkId: string = null;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.sharedLinkId = params.id;
        });
    }

}
