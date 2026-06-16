import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.css']
})
export class ProviderFormComponent implements OnInit {
  /** Fournisseur à éditer (null en création). Attendu : { code, label, siren, numeroTva, codeNaf } */
  @Input() provider: any = null;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  submitted = false;

  // Patterns volontairement permissifs (le back ne valide pas encore le format).
  private static readonly SIREN_PATTERN = /^\d{9}$/;
  private static readonly TVA_PATTERN = /^FR[0-9A-Z]{2}\d{9}$/;
  private static readonly NAF_PATTERN = /^\d{2}\.\d{2}[A-Z]$/;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      label: [this.provider?.label || '', [Validators.required]],
      siren: [this.provider?.siren || '', [Validators.pattern(ProviderFormComponent.SIREN_PATTERN)]],
      numeroTva: [this.provider?.numeroTva || '', [Validators.pattern(ProviderFormComponent.TVA_PATTERN)]],
      codeNaf: [this.provider?.codeNaf || '', [Validators.pattern(ProviderFormComponent.NAF_PATTERN)]],
    });
  }

  get label() { return this.form.get('label'); }
  get siren() { return this.form.get('siren'); }
  get numeroTva() { return this.form.get('numeroTva'); }
  get codeNaf() { return this.form.get('codeNaf'); }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    this.save.emit({
      code: this.provider?.code ?? null,
      label: (v.label || '').trim(),
      // Champ vidé => null (pas de chaîne vide en BDD).
      siren: (v.siren || '').trim() || null,
      numeroTva: (v.numeroTva || '').trim().toUpperCase() || null,
      codeNaf: (v.codeNaf || '').trim().toUpperCase() || null,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
