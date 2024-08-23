import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { QuoteService } from '../quote-service/quote.service';
import { Quote } from '../Interfaces/Quote';
import { MatDialog } from '@angular/material/dialog';
import { AddQuoteDialogComponent } from '../add-quote-dialog/add-quote-dialog.component';
import { EditListDialogComponent } from '../edit-list-dialog/edit-list-dialog.component';
import { QuoteDetailComponent } from '../quote-detail/quote-detail.component';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.css']
})
export class QuoteListComponent implements OnInit {

  displayedColumns: string[] = ['QuoteID', 'QuoteType', 'Description', 'DueDate', 'Premium', 'Sales', 'actions'];
  dataSource = new MatTableDataSource<Quote>();
  quote: Quote | undefined;
  searchID: number | null = null;
  descending = false;
  errorMessage: string = '';
  

  itemsPerPage = 5;
  itemsPerPageOptions = [5, 10, 15];
  currentPage = 1;
  totalRecords = 0;
  totalPages: number = 0; // Total number of pages
  pageSize = this.itemsPerPage;



  @ViewChild(MatSort) sort!: MatSort; null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currentSort = { field: 'QuoteID', direction: 'asc' };

  constructor(private quoteService: QuoteService, public dialog: MatDialog, private router: Router) { }


  ngOnInit(): void {
    this.loadQuotes();
    this.updatePagination(); 
  }

  ngAfterViewInit(): void{
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  sortBy(column: string) {
    const direction = this.descending ? 'desc' : 'asc';
    
    this.currentSort = { field: column, direction };

    if (this.dataSource.sort) {
      this.dataSource.sort.active = column;
      this.dataSource.sort.direction = direction;
      this.dataSource.sort.sortChange.emit();
    }
  }

  loadQuotes(): void {
    this.quoteService.getAllQuotes().subscribe({
      next: (data: Quote[]) => {
        this.totalRecords = data.length;
        this.dataSource.data = data.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
         this.totalPages = Math.ceil(this.totalRecords / this.itemsPerPage);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => console.error('Error fetching quotes', error)
    });
  }

  searchById(id: number): void {
    if (id != null) {
      this.quoteService.getById(id).subscribe(
        data => {
          this.dataSource.data = [data];
          this.errorMessage = ''; 
        },
        error => {
          console.error('Error searching quote by ID', error);
          this.errorMessage = `No quote found with ID: ${id}`;

          this.dataSource.data = []; 
        }
      );
    } else {
      this.loadQuotes();
      this.errorMessage = ''; 
    }
  }

  delete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: 'Are you sure?',
        message: 'Are you sure you want to delete this quote?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quoteService.deleteById(id).subscribe(
          () => {
            this.dataSource.data = this.dataSource.data.filter(quote => quote.QuoteID !== id);
          },
          error => console.error('Error deleting quote', error)
        );
      }
    });
  }

    openAddQuoteDialog(): void{
      const dialogRef = this.dialog.open(AddQuoteDialogComponent,{
        width: '70vw',
        height: '70vh', 
        maxWidth: '70vw', 
        maxHeight: '65vh', 
      });

      dialogRef.afterClosed().subscribe(result => {
        this.quoteService.createQuote(result).subscribe(newQuote => {
          this.dataSource.data = [...this.dataSource.data, newQuote];
          this.dataSource.paginator?.firstPage();
          this.updatePagination(); 
        },
        error => console.error('Error adding quote', error))
      });
    }

    openEditListDialog(quote: Quote): void {
      const dialogRef = this.dialog.open(EditListDialogComponent, {
        width: '70vw', 
        height: '70vh', 
        maxWidth: '70vw', 
        maxHeight: '65vh',
        data: quote
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.quoteService.editQuote(result.QuoteID, result).subscribe(
            () => {
              const index = this.dataSource.data.findIndex(q => q.QuoteID === result.QuoteID);
              if (index > -1) {
                this.dataSource.data[index] = result;
                this.dataSource.data = [...this.dataSource.data];
              }
            },
            error => console.error('Error updating quote', error)
          );
        }
      });
    }

    openQuoteDetail(quote: Quote): void {
      this.dialog.open(QuoteDetailComponent, {
        width: '50vw', 
        height: '50vh', 
        maxWidth: '50vw', 
        maxHeight: '60vh', 
        data: quote,
      });
    }

    generatePageNumbers(): number[] {
      const pageNumbers = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    updateItemsPerPage(event: Event): void {
      const target = event.target as HTMLSelectElement;
      this.itemsPerPage = parseInt(target.value, 10);
      this.pageSize = this.itemsPerPage;
      this.updatePagination();
    }
  
    updatePagination(): void {
      
      this.pageSize = this.itemsPerPage;
      
      this.totalPages = Math.ceil(this.totalRecords / this.itemsPerPage); 
      this.loadQuotes();
    }

    prevPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePagination();
      }
    }
  
    nextPage(): void {
      const maxPages = Math.ceil(this.totalRecords / this.itemsPerPage);
      if (this.currentPage < maxPages) {
        this.currentPage++;
        this.updatePagination();
      }
    }

    getPageRange(): string {
      const start = (this.currentPage - 1) * this.itemsPerPage + 1;
      const end = Math.min(this.currentPage * this.itemsPerPage, this.totalRecords);
      return `Showing ${start} to ${end} of ${this.totalRecords}`;
    }
    

  signOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}