import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';
@Component({
  selector: 'app-date-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './date-user.component.html',
  styleUrl: './date-user.component.css'
})
export class DateUserComponent implements OnInit{

  
  user:any = this.authService.getUser();

  constructor(
    public authService: AuthService,
    private snackBarService: SnackbarService
  ){

  }
 ngOnInit(): void {
 }




  Submit(form:any){
    this.authService.updateUser(this.user).subscribe(
      response=>{
        this.snackBarService.openSnackBar(response.message,'')
      },err=>{
        console.log(err)
      }
    )
  }
}
