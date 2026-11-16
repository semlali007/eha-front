import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-pcm-link',
  templateUrl: './sheet-form-pcm-link.component.html',
  styleUrls: ['./sheet-form-pcm-link.component.css']
})
export class SheetFormPcmLinkComponent {
  @Input() control: FormControl;
}
