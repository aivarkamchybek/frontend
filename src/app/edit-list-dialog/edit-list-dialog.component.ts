import { Component, Inject } from '@angular/core';
import { Quote } from '../Interfaces/Quote';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-list-dialog',
  templateUrl: './edit-list-dialog.component.html',
  styleUrls: ['./edit-list-dialog.component.css']
})
export class EditListDialogComponent {
  form: FormGroup;
  quoteTypes = ['House', 'Auto', 'Travel'];
  

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    
    this.form = this.fb.group({
      QuoteID: [data.QuoteID, Validators.required],
      QuoteType: [data.QuoteType, Validators.required],
      Description: [data.Description, Validators.required],
      DueDate: [data.DueDate, Validators.required],
      Premium: [data.Premium, Validators.required],
      Sales: [data.Sales, Validators.required]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}