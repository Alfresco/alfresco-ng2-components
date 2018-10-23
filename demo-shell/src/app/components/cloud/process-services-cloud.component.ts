import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-process-services-cloud',
  templateUrl: './process-services-cloud.component.html',
  styleUrls: ['./process-services-cloud.component.css']
})
export class ProcessServicesCloudComponent implements OnInit {

  showStartTask = false;
  appName: string;
  createdTaskDetails: any;
  showResponse = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router
  ) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
        this.appName = params['appName'];
    });
  }

  navigateStartTask() {
    this.showStartTask = true;
    this.showResponse = false;
  }

 onStartTaskSuccess(event: any) {
    this.showStartTask = false;
    this.showResponse = true;
    this.createdTaskDetails = event;
  }

  onCancelStartTask() {
    this.router.navigate(['/cloud/']);
  }
}
