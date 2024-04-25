import { Component, OnInit } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Global } from '../../model/global';
import { ProductService } from '../../services/product.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../services/snackbar.service';
import {MatTableModule} from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatToolbarModule,MatIconButton,MatIconModule, MatDialogModule,MatDialogActions,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatButtonModule,MatSelectModule,MatInputModule,FormsModule,MatTableModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{

  displayedColumns:String[]=['id','name','edit'];
  dataSource:any;
  categoryform: any = FormGroup;
  editform:any = FormGroup;
  responseMessage: any;
  idToEdit?:number;
  idToDelete?:number;
  nameCategory?:string;
  
  EditCategory:boolean = false
  confirm:boolean = false

  constructor(private formBuilder:FormBuilder,
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService){

  }

  ngOnInit(): void {
    this.categoryform = this.formBuilder.group({
      category:[null,[Validators.required,Validators.pattern(Global.nameRegex)]]
    });
    this.tableData();

  }

  tableData(){
    this.productService.getCategory().subscribe(
      (response)=>{
        this.dataSource = new MatTableDataSource(response)
      },(err)=>{
        console.log(err)
      }
    )
  }

  submit(){
    this.ngxService.start();
    var formData = this.categoryform.value;
    var data ={
      name: formData.category
    }
    this.productService.addCategory(data).subscribe(
      (response)=>{
        this.ngxService.stop();
        console.log(response.message);
        this.snackbarService.openSnackBar(response.message,'');
        this.categoryform.reset();
        this.ngOnInit();
      },(err)=>{
        this.ngxService.stop();
        if(err.error?.message){
          this.responseMessage = err.error?.message;
        }else{
          this.responseMessage = Global.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,Global.error)
      }
    );
  }

  Edit(value:any){
    this.editform = this.formBuilder.group({
      EditForm:[value.name,[Validators.required,Validators.pattern(Global.nameRegex)]]
    })
    this.idToEdit = value.id
    this.EditCategory = true
    
  }

  update(){
    this.ngxService.start();
    var formData = this.editform.value;
    var data ={
      id: this.idToEdit,
      name: formData.EditForm
    }
    this.productService.updateCategory(data).subscribe(
      (response)=>{
        this.ngxService.stop();
        console.log(response.message);
        this.snackbarService.openSnackBar(response.message,'');
        this.categoryform.reset();
        this.ngOnInit();
        this.EditCategory = false
      },(err)=>{
        this.ngxService.stop();
        if(err.error?.message){
          this.responseMessage = err.error?.message;
        }else{
          this.responseMessage = Global.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,Global.error)
      }
    );
  }

  deleteCategory(value:any){
     this.idToDelete = value.id
     this.nameCategory = value.name
     this.confirm = true
  }

  deleteConfirm(){
    this.ngxService.start();
    this.productService.deleteCategory(this.idToDelete).subscribe(
      (response)=>{
        this.ngxService.stop();
        console.log(response.message);
        this.snackbarService.openSnackBar(response.message,'');
        this.ngOnInit();
        this.confirm = false
      },(err)=>{
        this.ngxService.stop();
        if(err.error?.message){
          this.responseMessage = err.error?.message;
        }else{
          this.responseMessage = Global.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,Global.error)
      }
    );
  }

  closeConfirm(){
    this.confirm = false
  }



}
