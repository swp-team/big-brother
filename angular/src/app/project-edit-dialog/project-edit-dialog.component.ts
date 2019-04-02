import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Project, Student } from '@app/models';
import { ApiService } from '@app/api.service';

@Component({
  selector: 'app-project-edit-dialog',
  templateUrl: './project-edit-dialog.component.html',
  styleUrls: ['./project-edit-dialog.component.scss']
})
export class ProjectEditDialogComponent implements OnInit {
  students$: Observable<Student[]>;

  constructor(
    public dialogRef: MatDialogRef<ProjectEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public project: Project,
    public api: ApiService,
  ) { }

  ngOnInit() {
    this.students$ = combineLatest(
      this.api.getStudents(),
      this.api.getCourse(this.project.course),
    ).pipe(
      map(([s, c]) => s.filter(x => c.students.includes(x.id))),
    );
  }

}
