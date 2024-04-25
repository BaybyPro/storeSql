import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import { Global } from '../../model/global';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [MatToolbarModule,MatDialogModule,MatDialogActions,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatButtonModule,MatSelectModule,MatInputModule,],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit{

  loginform: any = FormGroup;
  responseMessage: any;


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    public dialogRef: MatDialogRef<SigninComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialog : MatDialog
  ) { }

  ngOnInit(): void {
    this.loginform = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(Global.emailRegex)]],
      password:[null,Validators.required]
    })
  }

  submit(){
    this.ngxService.start();
    var formData = this.loginform.value;
    var data = {
      email: formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe(
      (response)=>{
        localStorage.setItem('token',response.token);
        window.location.reload();
        this.dialogRef.close();
        this.ngxService.stop();
      },(err)=>{
        this.ngxService.stop();
        if(err.error?.message){
          this.responseMessage = err.error?.message;
        }else{
          this.responseMessage = Global.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,Global.error)
      }
    )
  }
  
  signup(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width="550px";
    dialogConfig.minHeight="200px";
    this.dialog.open(SignupComponent,dialogConfig);
    this.dialogRef.close();
  }

  forgotPassword(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width="550px";
    dialogConfig.minHeight="200px";
    this.dialog.open(ForgotPasswordComponent,dialogConfig)
  }
}
