import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, concat, combineLatest } from 'rxjs';
import { map, shareReplay, switchMap, toArray } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Student, Faculty, Project, Course, Diff } from '@app/models';
import { ApiService } from '@app/api.service';
import { ProjectEditDialogComponent } from '@app/project-edit-dialog/project-edit-dialog.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  course$: Observable<Course>;
  students$: Observable<Student[]>;
  faculties$: Observable<Faculty[]>;
  projects$: Observable<Project[]>;

  constructor(
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public api: ApiService,
  ) { }

  ngOnInit() {
    this.course$ = this.route.paramMap.pipe(
      switchMap(x => this.api.getCourse(+x.get('course'))),
      shareReplay(),
    );
    this.students$ = this.course$.pipe(
      map(x => x.students.map(s => this.api.getStudent(s))),
      switchMap(x => concat(...x).pipe(toArray())),
    );
    this.faculties$ = this.course$.pipe(
      map(x => x.faculties.map(s => this.api.getFaculty(s))),
      switchMap(x => concat(...x).pipe(toArray())),
    );
    this.projects$ = combineLatest(this.course$,
                                   this.api.getProjects()).pipe(
      map(([c, p]) => p.filter(x => x.course === c.id)),
    );
  }

  createDialog(course: Course) {
    const p: Diff<Project, 'id'> = {
      course: course.id,
      name: '',
      description: '',
      participants: [],
    };

    const dialogRef = this.dialog.open(ProjectEditDialogComponent, {
      width: '420px',
      data: p,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.postProject(result).subscribe(
        () => this.ngOnInit(),
      );
    });
  }

  editDialog(project: Project) {
    const dialogRef = this.dialog.open(ProjectEditDialogComponent, {
      width: '420px',
      data: project,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.postProject(result).subscribe(
        () => this.ngOnInit(),
      );
    });
  }

  delete(id: number) {
    this.api.deleteProject(id).subscribe();
    this.ngOnInit();
  }

}
