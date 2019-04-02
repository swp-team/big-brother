import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ApiService } from '@app/api.service';
import { Course, Project } from '@app/models';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  courses$: Observable<Course[]>;
  projects$: Observable<Project[]>;

  isHandset$: Observable<boolean> =
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches)
  );

  constructor(
    public breakpointObserver: BreakpointObserver,
    public router: Router,
    public route: ActivatedRoute,
    public api: ApiService,
  ) { }

  ngOnInit() {
    this.courses$ = this.api.getCourses();
    this.projects$ = this.api.getProjects();
  }

}
