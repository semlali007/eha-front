import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HotlineService } from 'src/app/core/services/hotline.service';
import { HotlineFamily } from 'src/app/shared/models/HotlineFamily';
import { HotlineTheme } from 'src/app/shared/models/hotlineTheme';
import { MinWordCountValidator } from 'src/app/shared/validators/min-word-count.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/core/services/message.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-hotline-form',
  templateUrl: './hotline-form.component.html',
  styles: [
  ]
})
export class HotlineFormComponent implements OnInit, OnDestroy {
  hotlineForm: FormGroup;
  themesList: HotlineTheme[] = [];
  familiesList: HotlineFamily[] = [];
  subscription: Subscription;
  sub: Subscription;
  message: string = '';
  defaultTheme = '';
  @Output() loadedResponse = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private hotlineService: HotlineService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }
  get theme() { return this.hotlineForm.get('theme') as any; }
  get category() { return this.hotlineForm.get('category') as any; }
  get family() { return this.hotlineForm.get('family') as any; }
  get question() { return this.hotlineForm.get('question') as any; }
  get entity() { return this.hotlineForm.get('entity') as any; }

  ngOnInit(): void {
    this.hotlineService.getConfig().subscribe(
      config => {
        this.themesList = config.themes;
        this.familiesList = config.families;
      }
    );



    this.createForm();

    this.sub = this.route.queryParams.subscribe(params => {
      if(!!params && !!params.theme && params.theme == 'sheet'){
        this.theme.setValue(22);
         console.log('okokok');
      }
  });

    this.subscription = this.messageService.getMessage().subscribe((data) => {
      if (!!data && !!data.hotlineForm && data.hotlineForm == 'reload') {
        this.hotlineForm.reset();
        this.loadedResponse.emit('');
      }
    });

  }
  createForm() {
    console.log(this.authService.currentUser);
    return this.hotlineForm = this.fb.group({
      theme: ['', [Validators.required]],
      category: ['', [Validators.required]],
      family: ['', [Validators.required]],
      question: ['', [Validators.required, MinWordCountValidator(5)]],
      entity: new FormControl({ value: this.authService.currentUser.direction, disabled: true }, Validators.required),
    });
  }

  submit() {
    
    let params = {
      theme: this.theme.value,
      category: this.category.value,
      post: this.question.value,
      entity: this.entity.value
    }

    this.hotlineService.createHotline(params).subscribe(result => {
      if (result.message !== undefined) {
        this.loadedResponse.emit(result.message);
      }
      if (result.status === true) {
        this.router.navigate(['app/hotline/list']);
      }
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.sub.unsubscribe();
   }
}
