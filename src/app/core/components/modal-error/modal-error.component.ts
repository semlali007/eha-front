import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { ErrorDetail } from 'src/app/shared/models/error-detail';

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.css']
})
export class ModalErrorComponent implements OnInit {
  public errorDetail$: Observable<ErrorDetail | null>;
  public showDetails: boolean = false;
  public copied: boolean = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.errorDetail$ = this.modalService.errorDetail$;
  }

  hideModal(): void {
    this.modalService.closeErrorDetail();
    this.showDetails = false;
    this.copied = false;
  }

  onHidden(): void {
    this.hideModal();
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  async copy(text: string): Promise<void> {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    } catch {
      this.copied = false;
    }
  }
}
