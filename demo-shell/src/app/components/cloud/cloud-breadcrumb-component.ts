/*
 * Copyright 2005-2018 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-cloud-breadcrumbs',
    templateUrl: './cloud-breadcrumb-component.html',
    styleUrls: ['cloud-breadcrumb-component.scss']
})

export class CloudBreadcrumbsComponent implements OnInit {

  applicationName: string;
  filterName: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
        this.applicationName = params.applicationName;
    });

    this.route.queryParams.subscribe(params => {
        if (params.filterName) {
            this.filterName = params.filterName;
        }
    });
  }
}
