import { Component,OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product';
import { Global } from '../../model/global';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import {MatButtonModule} from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import {MatTableModule} from '@angular/material/table';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink,MatIconModule,FormsModule,MatFormFieldModule,ReactiveFormsModule,MatToolbarModule,MatDialogModule,MatDialogActions,MatInputModule,
    MatFormFieldModule,MatButtonModule,MatTableModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
  
  displayedColumns:String[]=['description','edit']
  dataSource:any;
  descriptionform:any = FormGroup
  editform:any = FormGroup;
  responseMessage:any;
  idToEdit?:number;
  idToDelete?:number;
  EditDescription: boolean = false
  nameDescription?:string;
  discount?:number
  public url: any;
  public compo : any;
  public confirm : boolean;
   confirm2 : boolean = false;
   selectedImage: string | null = null;
  constructor(
    private service : ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder:FormBuilder,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
  ){
      this.url = Global.apiUrl
      this.compo = Product;
      this.confirm = false;
  }
  ngOnInit(): void {
    this.descriptionform = this.formBuilder.group({
      description:[null,[Validators.required]],
    })
     this.route.params.subscribe(
      params =>{
        let id = params['id'];
        console.log(id)
        this.getCompo(id)
        this.tableData(id);
      }
     )
     
  }

  tableData(product_id:any){
    var data = {product_id:product_id}
    this.service.getDescription(data).subscribe(
      (response)=>{
        this.dataSource = new MatTableDataSource(response)
      },(err)=>{
        console.log(err)
      }
    )
  }

  getCompo(id:any){
      this.service.getCompo(id).subscribe(
        response =>{
              this.compo = response
              this.discount = Math.floor(response.price-(response.price*(response.discount/100)))
              this.selectedImage = response.image
        },
        error=>{
          console.log(error)
        }
      )
  }

  deleteCompo(id:any){
      this.service.deleteCompo(id).subscribe(
        response=>{

            this.router.navigate(['/private'])
           
        },
        err =>{
          console.log(err)
        }
      )
  }

  setConfirm(confirm:boolean){
    this.confirm = confirm;
  }

  Submit(){
    var formData = this.descriptionform.value;
    var data ={
      product_id: this.compo.id,
      description: formData.description
    }
    this.service.addDescription(data).subscribe(
      (response)=>{
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage,"")
        this.descriptionform.reset();
      },
      (err)=>{
        if(err.error?.message){
          this.responseMessage = err.error?.message;
       }else{
        this.responseMessage = Global.genericError;
       }
       this.snackbarService.openSnackBar(this.responseMessage,Global.error)
      }
    );
    this.ngOnInit();
  }

  Edit(value:any){
    this.editform = this.formBuilder.group({
      descriptionEdit:[value.description,[Validators.required,Validators.pattern(Global.nameRegex)]]
    })
    this.idToEdit = value.id
    this.EditDescription = true
    
  }

  

  SubmitEdit(){
    this.ngxService.start();
    var formData = this.editform.value;
    var data ={
      id: this.idToEdit,
      description: formData.descriptionEdit
    }
    this.service.updateDescription(data).subscribe(
      (response:any)=>{
        this.ngxService.stop();
        this.snackbarService.openSnackBar(response.message,'');
        this.descriptionform.reset();
        this.ngOnInit();
        this.EditDescription = false
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

  deleteDescription(value:any){
    this.idToDelete = value.id
    this.nameDescription = value.description
    this.confirm2 = true
 }

 deleteConfirm(){
  this.ngxService.start();
  this.service.deleteDescription(this.idToDelete).subscribe(
    (response:any)=>{
      this.ngxService.stop();
      this.snackbarService.openSnackBar(response.message,'');
      this.ngOnInit();
      this.confirm2 = false
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
  this.confirm2 = false
}

showImage(image: string) {
  this.selectedImage = image;
}

}