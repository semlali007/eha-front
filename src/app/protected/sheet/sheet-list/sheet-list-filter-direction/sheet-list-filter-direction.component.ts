import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sheet-list-filter-direction',
  templateUrl: './sheet-list-filter-direction.component.html',
  styleUrls: ['./sheet-list-filter-direction.component.css']
})

export class SheetListFilterDirectionComponent implements OnInit, OnChanges {

  @Input() directions: any = [];
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];

  myForm: FormGroup;
  isTotalCollapsed = true;
  selectedItems: any[] = [];
  available: any[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({ state: [''] });
    this.syncSelected();
  }

  ngOnChanges(): void {
    this.syncSelected();
  }

  private currentCodes(): any[] {
    return this.directions && this.directions.value ? this.directions.value : [];
  }

  private syncSelected(): void {
    const codes = this.currentCodes();
    const byCode = new Map<any, any>();
    (this.list || []).forEach((o: any) => byCode.set(o.code, o));
    this.selectedItems = codes.map((c: any) => byCode.get(c) || { code: c, name: c, count: null });
    this.recomputeAvailable();
  }

  private recomputeAvailable(): void {
    const codes = this.currentCodes();
    this.available = (this.list || []).filter((o: any) => !codes.includes(o.code));
  }

  onSelect(event: any): void {
    const item = event.item;
    const codes = this.currentCodes();
    if (item && !codes.includes(item.code)) {
      const value = [...codes, item.code];
      this.directions.setValue(value);
      this.selectedItems = [...this.selectedItems, item];
      this.recomputeAvailable();
      this.changedFilter.emit({ type: 'directions', value });
    }
    this.myForm.reset();
  }

  deleteOne(code: any): void {
    const value = this.currentCodes().filter((c: any) => c !== code);
    this.directions.setValue(value);
    this.selectedItems = this.selectedItems.filter((s) => s.code !== code);
    this.recomputeAvailable();
    this.changedFilter.emit({ type: 'directions', value });
  }
}
