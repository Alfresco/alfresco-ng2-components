import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-process-services-cloud',
  templateUrl: './process-services-cloud.component.html',
  styleUrls: ['./process-services-cloud.component.css']
})
export class ProcessServicesCloudComponent implements OnInit {

  showStartTask = false;
  runtimeBundle = 'sentiment-analysis-app';
  createdTaskDetails: any;
  showResponse = false;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
      this.route.params.subscribe(params => {
        const runtimeBundle = params['appId'];
        if (runtimeBundle && runtimeBundle !== '0') {
          this.runtimeBundle = params['runtimeBundle'];
        }
    });
  }

  navigateStartTask() {
    this.showStartTask = true;
  }

    onStartTaskSuccess(event: any) {
    this.showStartTask = false;
    this.showResponse = true;
    this.createdTaskDetails = event;

  }

  onCancelStartTask() {
    // TODO
  }
}
