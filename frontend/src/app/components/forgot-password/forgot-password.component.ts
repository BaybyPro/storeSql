import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { Global } from '../../model/global';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MatToolbarModule,MatDialogModule,MatDialogActions,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatButtonModule,MatSelectModule,MatInputModule /* espacio */],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
   forgotPasswordForm : any = FormGroup;
   responseMessage :any;
   constructor(
    private formBulder:FormBuilder,
    private userServices : UserService,
    private dialogRef:MatDialogRef<ForgotPasswordComponent>,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService
   ){
     
   }

   ngOnInit(): void {
    this.forgotPasswordForm = this.formBulder.group({
      email:[null,[Validators.required,Validators.pattern(Global.emailRegex)]]
    });
   }

   Submit(){
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data ={
      email : formData.email
    }
    this.userServices.fogotPassword(data).subscribe(
      (response)=>{
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.dialogRef.close();
        this.snackbarService.openSnackBar(this.responseMessage,"")
      },(err)=>{
        this.ngxService.stop();
        if(err.error?.message){
          this.responseMessage = err.error?.message
        }else{
          this.responseMessage = Global.genericError
        }
        this.snackbarService.openSnackBar(this.responseMessage,Global.error)
      }
    )
   }
}
