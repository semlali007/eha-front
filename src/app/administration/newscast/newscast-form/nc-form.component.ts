import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { NewsCastService } from 'src/app/core/services/newscast.service';

@Component({
  selector: 'app-nc-form',
  templateUrl: './nc-form.component.html',
  styleUrls: [
    '../../admin-shared.css',
    './nc-form.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NcFormComponent implements OnInit, OnDestroy {
  public newsId: string = '';
  public ncForm!: FormGroup;
  public user!: User | null;
  public subscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private newsCastService: NewsCastService,
  ) {}

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
    this.init();
  }

  get title() { return this.ncForm.get('title'); }
  get long_description() { return this.ncForm.get('long_description'); }
  get short_description() { return this.ncForm.get('short_description'); }
  get categoryId() { return this.ncForm.get('categoryId') as any; }
  get status() { return this.ncForm.get('status') as any; }
  get is_home() { return this.ncForm.get('is_home'); }

  resetSheetForm(): void {
    this.ncForm.reset();
  }

  init(): void {
    this.newsId = '';
    this.ncForm = this.createForm();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.newsId = params['id'];
        this.newsCastService.get(params['id']).subscribe(data => {
          this.resetSheetForm();
          if (!data) return;
          this.initEditForm(data);
        });
      }
    });
  }

  cancel(): void {
    if (this.newsId !== '') {
      this.router.navigate([`/admin/actualites/detail/${this.newsId}`]);
    } else {
      this.router.navigate(['/admin/actualites']);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      long_description: [''],
      short_description: [''],
      categoryId: [0],
      status: [0],
      is_home: [false],
    });
  }

  initEditForm(data: any): void {
    this.short_description?.setValue(data.short_description);
    this.long_description?.setValue(data.long_description);
    this.categoryId?.setValue(data.category);
    this.title?.setValue(data.title);
    this.status?.setValue(data.status);
    this.is_home?.setValue(data.is_home);
  }

  submit(): void {
    const options: any = {
      id: null,
      title: this.title?.value,
      long_description: this.long_description?.value,
      short_description: this.short_description?.value,
      categoryId: this.categoryId?.value,
      status: this.status?.value,
      is_home: this.is_home?.value,
    };

    if (this.newsId !== '') {
      options.id = this.newsId;
      this.newsCastService.update(options).subscribe(() => {
        this.router.navigate(['/admin/actualites']);
      });
    } else {
      this.newsCastService.create(options).subscribe(() => {
        this.router.navigate(['/admin/actualites']);
      });
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
