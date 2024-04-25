import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Global } from '../../model/global';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import {MatButtonModule} from '@angular/material/button';
import { LoaderService } from '../../services/loader.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SigninComponent } from '../signin/signin.component';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatToolbarModule,MatDialogModule,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatInputModule,MatSelectModule,MatDialogActions,MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  
  loaderService = inject(LoaderService)
  signupForm:any = FormGroup;
  responseMessage:any;
  constructor(
    private formBuilder:FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef:MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService,
    private dialog : MatDialog
    ) {
    
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(Global.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(Global.emailRegex)]],
      contacNumber:[null,[Validators.required,Validators.pattern(Global.contacNumberRegex)]],
      password:[null,[Validators.required]],
      
    })
  }

  Submit(){
    this.loaderService.startLoader();
    var FormData = this.signupForm.value;
    var data = {
      name: FormData.name,
      email: FormData.email,
      contactNumber: FormData.contacNumber,
      password: FormData.password
    }
    this.userService.signup(data).subscribe(
      (response:any)=>{
         this.loaderService.stopLoader();
         this.dialogRef.close();
         this.responseMessage = response?.message;
         this.snackbarService.openSnackBar(this.responseMessage,"");
         this.router.navigate(['/']);
      },
      (err)=>{
         this.loaderService.stopLoader();
         if(err.error?.message){
            this.responseMessage = err.error?.message;
         }else{
          this.responseMessage = Global.genericError;
         }
         this.snackbarService.openSnackBar(this.responseMessage,Global.error)
      }
    )
  }

  signin(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width="550px";
    dialogConfig.minHeight="200px";
    this.dialog.open(SigninComponent,dialogConfig)
  }
}
