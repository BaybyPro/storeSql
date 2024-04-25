import { Component } from '@angular/core';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { UploadService } from '../../services/upload.service';
import { Global } from '../../model/global';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [RouterLink,FormsModule,MatSelect,MatOption,MatFormFieldModule],
  templateUrl: '../create/create.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
 
  public status : boolean;
  public filesToUpload : Array<File> =[];
  public title : string
  public compo : any;
  public success : string;
  public url : any;
  public saveCompo: any;
  categorys:any = []

  constructor(
    private _service: ProductService,
    private uploadService : UploadService,
    private router : Router,
    private route: ActivatedRoute
  ){
    this.status = false
    this.compo = Product
    this.title = 'Editar componente';
    this.url = Global.apiUrl;
    this.success = 'Componente editado, puede ver los detalles';
  }
  ngOnInit(): void {
    this.route.params.subscribe(
     params =>{
       let id = params['id'];
       this.getCompo(id)
     }
    )
    this.getCategorys();
 }

 getCompo(id:any){
     this._service.getCompo(id).subscribe(
       response =>{
             this.compo = response
       },
       error=>{
         console.log(error)
       }
     )
 }

 hideStatus(){
  this.status = false
       
}

onSubmit(form:any){
  this._service.updateCompo(this.compo).subscribe(
    response =>{
       if(response){
        this.saveCompo = response.product
        if(this.filesToUpload){
           //subir imagen
           this.uploadService.makeFileRequest(this.url+"/product/uploadImage/"+response.product.id,[], this.filesToUpload, ['image', 'image2', 'image3'])

          .then((resulst:any)=>{
            this.status = true
              
          });
        }  else{
          this.status = true;
          console.log(response)
        }
       }else{
        this.status = false
       }
    },
    error=>{
      console.log(<any>error)
    }
  )
}

fileChangeEvent(fileInput:any){
  this.filesToUpload = <Array<File>>fileInput.target.files;
}

getCategorys(){
  this._service.getCategory().subscribe(
    (response)=>{
    this.categorys = response
    },(err)=>{
      console.log(err)
    }
  )
}

}
