import { COMPILER_OPTIONS, Component, OnInit } from '@angular/core';
import { Product } from '../../model/product';
import { UploadService } from '../../services/upload.service';
import { Global } from '../../model/global';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDialogModule, MatDialogActions } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule,RouterLink,MatDialogActions,MatDialogModule,MatButtonModule,MatSelect,MatOption,MatFormFieldModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit{
  public compo : Product;
  public status : boolean;
  public filesToUpload : Array<File> =[];
  public title : string
  public success: string;
  public url : any;
  public saveCompo: any;
  categorys:any = []
  constructor(
    private _service: ProductService,
    private uploadService : UploadService
  ){
    this.compo = new Product('','','','','',0.00,0,0,'','',''),
    this.status = false
    this.title = 'Crear nuevo componente'
    this.url = Global.apiUrl;
    this.success = 'Componente creado puedes añadir sus detalles '
  }

  ngOnInit(): void {
    this.getCategorys();
  }

  onSubmit(form:any){
    this._service.addProduct(this.compo).subscribe(
      (response:any) =>{
         if(response){
          //subir imagen
          this.uploadService.makeFileRequest(this.url+"/product/uploadImage/"+response.product.id,[], this.filesToUpload, ['image', 'image2', 'image3'])

          .then((result:any)=>{
            this.status = true
              
              this.saveCompo = result.product[0]
              form.reset();
              
          });
          form.reset();
         }else{
          this.status = false
         }
      },
      (error:any)=>{
        console.log(<any>error)
      }
    )
  }

  hideStatus(){
    this.status = false
         
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
