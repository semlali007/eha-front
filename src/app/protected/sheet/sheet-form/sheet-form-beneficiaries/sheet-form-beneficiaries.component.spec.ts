import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetFormBeneficiariesComponent } from './sheet-form-beneficiaries.component';

describe('SheetFormBeneficiariesComponent', () => {
  let component: SheetFormBeneficiariesComponent;
  let fixture: ComponentFixture<SheetFormBeneficiariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetFormBeneficiariesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetFormBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
