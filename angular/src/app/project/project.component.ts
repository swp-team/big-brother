import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { switchMap, shareReplay, map, filter } from 'rxjs/operators';

import { Project, Activity } from '@app/models';
import { ApiService } from '@app/api.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  project$: Observable<Project>;
  tracked$ = new BehaviorSubject<Activity>(null);
  activities$: Observable<Activity[]>;

  constructor(public route: ActivatedRoute,
              public api: ApiService) { }

  ngOnInit() {
    this.project$ = this.route.paramMap.pipe(
      switchMap(x => this.api.getProject(+x.get('project'))),
      shareReplay(),
    );
    const cleanTracked$ = this.tracked$.pipe(filter(x => x !== null));
    this.activities$ = combineLatest(this.project$,
                                     this.api.getActivities(),
                                     cleanTracked$).pipe(
      map(([p, a, t]) => a.filter(x => x.project === p.id).concat(t)),
    );
  }

  track(name: string) {
  }

}
