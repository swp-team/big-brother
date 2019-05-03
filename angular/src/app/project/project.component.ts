import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, BehaviorSubject, interval, Subscription } from 'rxjs';
import { switchMap, shareReplay, map, filter, flatMap, switchMapTo, tap } from 'rxjs/operators';

import { Project, Activity, Duration, Student } from '@app/models';
import { ApiService } from '@app/api.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  project$ = new BehaviorSubject<Project>(null);
  allActivities$ = new BehaviorSubject<Activity[]>([]);
  projectActivities$ = new BehaviorSubject<Activity[]>([]);
  tracked$ = new BehaviorSubject<Activity[]>([]);
  finished$ = new BehaviorSubject<Activity[]>([]);
  activities$ = new BehaviorSubject<Activity[]>([]);
  students$: Observable<Student[]>;
  timer: Subscription = null;

  participants$ = new BehaviorSubject<{ [id: number]: string }>({});

  constructor(public route: ActivatedRoute,
              public api: ApiService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(x => this.api.getProject(+x.get('project'))),
    ).subscribe(x => this.project$.next(x));

    const cleanProject$ = this.project$.pipe(filter(x => x !== null));

    this.api.getActivities().subscribe(x => this.allActivities$.next(x));

    combineLatest(cleanProject$,
                  this.allActivities$).pipe(
      map(([p, a]) => a.filter(x => x.project === p.id)),
    ).subscribe(x => this.projectActivities$.next(x));

    this.projectActivities$.pipe(
      map(x => x.filter(a => !a.end)),
      tap(x => x.forEach(a => {
        a.duration = new Duration(
          Date.now() - a.start.getTime()
        );
      })),
    ).subscribe(x => this.tracked$.next(x));

    this.projectActivities$.pipe(
      map(x => x.filter(a => a.end)),
    ).subscribe(x => this.finished$.next(x));

    combineLatest(this.tracked$, this.finished$).pipe(
      map(([t, f]) => t.concat(f)),
    ).subscribe(x => this.activities$.next(x));

    this.students$ = combineLatest(
      this.api.getStudents(),
      cleanProject$,
    ).pipe(
      map(([s, p]) => s.filter(x => p.participants.includes(x.id))),
    );

    combineLatest(this.students$, this.activities$).pipe(
      map(([x, as]) => as.map(
        a => [a.id, x.filter(s => a.participants.includes(s.id))
              .map(s => `${s.first_name} ${s.second_name}`)
              .join(', ')]
      ).reduce((acc, [id, ss]) => ({ [id]: ss, ...acc }), {})),
    ).subscribe(x => this.participants$.next(x));

    this.timer = interval(1000).subscribe(() => {
      const tracked = this.tracked$.value;
      for (let i = 0; i < tracked.length; i++) {
        tracked[i].duration = new Duration(
          Date.now() - tracked[i].start.getTime()
        );
      }
    });
  }

  track(name: string, participants: number[]) {
    participants = participants === undefined ? [] : participants;
    const a = {
      id: null,
      name: name,
      end: null,
      duration: new Duration(0),
      participants: participants,
      project: this.project$.value.id,
      start: new Date(),
      tags: [],
    };
    this.tracked$.next([a, ...this.tracked$.value]);
    this.api.postActivities(a).subscribe(x => {
      a.id = x.id;
      this.activities$.next(this.activities$.value);
    });
  }

  stop(a: Activity) {
    a.end = new Date();
    this.api.putActivity(a).pipe(
      switchMapTo(this.api.getActivities()),
    ).subscribe(x => this.allActivities$.next(x));
  }

}
