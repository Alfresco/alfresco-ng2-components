import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  appId: string = null;

  constructor(private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const applicationId = params['appId'];
      if (applicationId && applicationId !== '0') {
          this.appId = params['appId'];
      }
    });
  }

  onRowClick(taskId: string) {
    if (taskId) {
      this.router.navigate(['/apps', this.appId || 0, 'tasks', taskId]);
    }
  }

}
