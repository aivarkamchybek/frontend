import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quote } from '../Interfaces/Quote';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.css']
})
export class QuoteDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Quote) {
    
  }

  getImageSource(quoteType: string): string {
    switch (quoteType.toLowerCase()) {
      case 'auto':
        return 'assets/auto.png';
      case 'health':
        return 'assets/health.png';
      case 'travel':
        return 'assets/travel.png';
      case 'house':
        return 'assets/house.png';
      default:
        return 'assets/default.png'; // Fallback image if none matches
    }
}
}