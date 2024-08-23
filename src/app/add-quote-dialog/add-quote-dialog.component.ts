import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-quote-dialog',
  templateUrl: './add-quote-dialog.component.html',
  styleUrls: ['./add-quote-dialog.component.css']
})
export class AddQuoteDialogComponent {
  newQuote = {QuoteID:'', QuoteType: '', Description: '', DueDate: '', Premium:'', Sales: ''};
  quoteForm!: FormGroup;
  quoteTypes = ['Health', 'Auto', 'Travel'];

  constructor(
    public dialogRef: MatDialogRef<AddQuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ){
    this.newQuote = {...data};
    this.initForm();
  }

  ngOnInit(): void{}

  initForm(): void{
    this.quoteForm = this.fb.group({
      QuoteID:[this.newQuote.QuoteID, Validators.required],
      QuoteType:[this.newQuote.QuoteType, Validators.required],
      Description:[this.newQuote.Description, Validators.required],
      DueDate: [this.newQuote.DueDate, Validators.required],
      Premium:[this.newQuote.Premium, Validators.required],
      Sales:[this.newQuote.Sales, Validators.required],
    })
  }

  addQuote(): void{
    if(this.quoteForm.valid){
      this.dialogRef.close(this.quoteForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
