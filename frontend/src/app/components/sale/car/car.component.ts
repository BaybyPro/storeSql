import { Component, OnInit } from '@angular/core';
import { ProductSale } from '../../../model/productSale';
import { Global } from '../../../model/global';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from '../../../services/auth.service';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { SnackbarService } from '../../../services/snackbar.service';
import { ProductService } from '../../../services/product.service';
import { subscribe } from 'diagnostics_channel';


@Component({
  selector: 'app-car',
  standalone: true,
  imports: [FormsModule,MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent implements OnInit {
  listItemsCar: ProductSale[] | undefined;
  url: any = Global.apiUrl;
  cantidad: number | undefined;
  totalPrice: any = 0;
  validCount:boolean=  true;
  provincias: string[]=[];
  distrito: string[]=[];
  departamento: string = '';
  provincia: string = '';
  currierform:any = FormGroup;
  CodeSale:string ='';
  user:any|undefined = this.authService.getUser();
  departamentos = [
    { 
        nombre: 'AMAZONAS', 
        provincias: [
            { nombre: 'Chachapoyas', distritos: ['Chachapoyas'] },
            { nombre: 'Bongara', distritos: ['Bongara'] },
            { nombre: 'Utcubamba', distritos: ['Bagua grande'] }
        ]
    },
    { 
        nombre: 'ANCASH', 
        provincias: [
            { nombre: 'Huaraz', distritos: ['Huaraz'] },
            { nombre: 'Santa', distritos: ['Chimbote'] }
        ]
    },
    { 
        nombre: 'APURIMAC', 
        provincias: [
            { nombre: 'Abancay', distritos: ['Abancay'] },
            { nombre: 'Andahuaylas', distritos: ['Andahuaylas'] }
        ]
    },
    { 
        nombre: 'AREQUIPA', 
        provincias: [
            { nombre: 'Arequipa', distritos: ['Arequipa'] },
            { nombre: 'Camana', distritos: ['Camana'] }
        ]
    },
    { 
        nombre: 'AYACUCHO', 
        provincias: [
            { nombre: 'Huamanga', distritos: ['Huamanga'] },
            { nombre: 'Huanta', distritos: ['Huanta'] }
        ]
    },
    { 
        nombre: 'CAJAMARCA', 
        provincias: [
            { nombre: 'Cajamarca', distritos: ['Cajamarca'] },
            { nombre: 'Chota', distritos: ['Chota'] },
            { nombre: 'Jaen', distritos: ['Jaen'] }
        ]
    },
    { 
        nombre: 'CALLAO', 
        provincias: [
            { nombre: 'Callao', distritos: ['Callao'] }
        ]
    },
    { 
        nombre: 'CUSCO', 
        provincias: [
            { nombre: 'Cusco', distritos: ['Cusco'] },
            { nombre: 'Canchis', distritos: ['Canchis'] },
            { nombre: 'Espinar', distritos: ['Espinar'] }
        ]
    },
    { 
        nombre: 'HUANCAVELICA', 
        provincias: [
            { nombre: 'Huancavelica', distritos: ['Huancavelica'] }
        ]
    },
    { 
        nombre: 'HUANUCO', 
        provincias: [
            { nombre: 'Huanuco', distritos: ['Huanuco'] }
        ]
    },
    { 
        nombre: 'ICA', 
        provincias: [
            { nombre: 'Ica', distritos: ['Ica'] },
            { nombre: 'Chincha', distritos: ['Chincha alta', 'Chincha baja'] },
            { nombre: 'Nazca', distritos: ['Nazca'] },
            { nombre: 'Pisco', distritos: ['Pisco'] }
        ]
    },
    { 
        nombre: 'JUNIN', 
        provincias: [
            { nombre: 'Huancayo', distritos: ['Huancayo'] },
            { nombre: 'Jauja', distritos: ['Jauja'] },
            { nombre: 'Yauli', distritos: ['La oroya'] },
            { nombre: 'Chupaca', distritos: ['Chupaca'] }
        ]
    },
    { 
        nombre: 'LA LIBERTAD', 
        provincias: [
            { nombre: 'Trujillo', distritos: ['Trujillo','El porvenir','Florencia de mora','La esperanza'] },
            { nombre: 'Ascope', distritos: ['Ascope'] },
            { nombre: 'Bolivar', distritos: ['Bolivar'] },
            { nombre: 'Chepen', distritos: ['Chepen'] },
            { nombre: 'Pacasmayo', distritos: ['Pacasmayo'] }
        ]
    },
    { 
        nombre: 'LAMBAYEQUE', 
        provincias: [
            { nombre: 'Chiclayo', distritos: ['Chiclayo'] },
            { nombre: 'Lambayeque', distritos: ['Lambayeque'] }
        ]
    },
    { 
        nombre: 'LIMA', 
        provincias: [
            { nombre: 'Lima', distritos: ['Lima','Ancon','Ate','Barranco','Breña','Independencia','Jesus maria','La molina','La victoria','Lince','Los olivos','Lurin','Miraflores','Pachacamac','Puente piedra','Punta hermosa','Punta negra','Rimac','San bartolo','San borja','San juan de lurigancho','San juan de miraflores','Pueblo libre','San martin de porres','San miguel','Santa anita','Santa maria del mar','Santa rosa','Santiago de surco','Surquillo','Villa el salvador','Villa maria del triunfo'] },
            { nombre: 'Barranca', distritos: ['Barranca'] },
            { nombre: 'Cajatambo', distritos: ['Cajatambo'] },
            { nombre: 'Canta', distritos: ['Canta'] },
            { nombre: 'Huaral', distritos: ['Huaral'] },
            { nombre: 'Huarochiri', distritos: ['Huarochiri'] }
        ]
    },
    { 
        nombre: 'LORETO', 
        provincias: [
            { nombre: 'Iquitos', distritos: ['Iquitos'] },
            { nombre: 'Loreto', distritos: ['Loreto'] }
        ]
    },
    { 
        nombre: 'MADRE DE DIOS', 
        provincias: [
            { nombre: 'Tambopata', distritos: ['Puerto maldonado'] }
        ]
    },
    { 
        nombre: 'MOQUEGUA', 
        provincias: [
            { nombre: 'Moquegua', distritos: ['Moquegua'] },
            { nombre: 'Ilo', distritos: ['Ilo'] }
        ]
    },
    { 
        nombre: 'PASCO', 
        provincias: [
            { nombre: 'Pasco', distritos: ['Pasco'] }
        ]
    },
    { 
        nombre: 'PIURA', 
        provincias: [
            { nombre: 'Piura', distritos: ['Piura'] },
            { nombre: 'Morropon', distritos: ['Chulucanas'] },
            { nombre: 'Paita', distritos: ['Paita'] }
        ]
    },
    { 
        nombre: 'PUNO', 
        provincias:[
          { nombre: 'Puno', distritos: ['Puno'] },
          { nombre: 'San roman', distritos: ['Juliaca','San miguel','Caracoto'] },
          { nombre: 'Melgar', distritos: ['Ayaviri'] }
        ]
    },
    { 
      nombre: 'SAN MARTIN', 
      provincias:[
        { nombre: 'Moyobamba', distritos: ['Moyobamba'] },
        { nombre: 'San martin', distritos: ['Tarapoto'] },
        { nombre: 'Rioja', distritos: ['Rioja','Nueva cajamarca'] },
      ]
    },
    { 
      nombre: 'TACNA', 
      provincias:[
        { nombre: 'Tacna', distritos: ['Tacna'] }
      ]
    },
    { 
      nombre: 'TUMBES', 
      provincias:[
        { nombre: 'Tumbes', distritos: ['Tumbes'] },
        { nombre: 'Zarumilla', distritos: ['Zarumilla'] },
      ]
    },
    { 
      nombre: 'UCAYALI', 
      provincias:[
        { nombre: 'Pucallpa', distritos: ['Pucallpa'] },
        { nombre: 'Coronel Portillo', distritos: ['Coronel Portillo'] },
      ]
    }
  ]
 

  firstFormGroup =this.formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  constructor(
    private ngxService: NgxUiLoaderService,
    public authService: AuthService,
    private producService: ProductService,
    private snackbarService: SnackbarService,
    private formBuilder: FormBuilder
  ) {
  }


  ngOnInit(): void {
    let carStorage = sessionStorage.getItem("car") as string;
    let car = JSON.parse(carStorage);
    this.listItemsCar = car;
    this.calculateTotal(); // Calcular el precio total inicial
    if(!this.listItemsCar || this.listItemsCar.length <= 0){
      this.validCount = false
    }
    this.currierform = this.formBuilder.group({
      names:[this.user?.nombres || null,[Validators.required,Validators.pattern(Global.datesNames)]],
      lastnames:[this.user?.apellidos ||null,[Validators.required,Validators.pattern(Global.datesNames)]],
      document:[null,[Validators.required,Validators.pattern(Global.datesNumber)]],
      email:[this.user?.email ||null,[Validators.required,Validators.pattern(Global.emailRegex)]],
      contactNumber:[this.user?.contactNumber ||null,[Validators.required,Validators.pattern(Global.contacNumberRegex)]],
      departamento:[null,[Validators.required]],
      provincia:[null,[Validators.required]],
      typeDocument:[null,[Validators.required]],
      distrito:[null,[Validators.required]]
    })
  }

  deleteProduct(productId: any) {
    this.ngxService.start();
    let carStorage = sessionStorage.getItem("car") || '[]';
    let car = JSON.parse(carStorage);
    let countString = sessionStorage.getItem("totalQuantity") ;
    let count = countString ? parseInt(countString) : 0;
    const index = car.findIndex((item:any) => item.id === productId);
    if(index !== -1){
      // Resta la cantidad del producto eliminado del valor total
      count -= car[index].count;
      
      car.splice(index, 1); // Elimina el producto del arreglo
      sessionStorage.setItem("car", JSON.stringify(car));
      sessionStorage.setItem("totalQuantity", count.toString()); // Actualiza el total en sessionStorage
      window.location.reload();
      this.ngxService.stop();  
    }
  }

  calculateTotal() {
    // Calcular el precio total sumando el precio de cada producto en el carrito
    this.totalPrice = this.listItemsCar?.reduce((total, item) => total + (item.discountedPrice * item.count), 0);
  }
  updateProduct(countInput:any,productId:any,status:any){
    if(countInput>status|| countInput <= 0){
      this.snackbarService.openSnackBar("No hay esa cantidad de stock",Global.error) 
    }else{
      this.ngxService.start();
      let carStorage = sessionStorage.getItem("car") || '[]';
      let car = JSON.parse(carStorage);
      
      const index = car.findIndex((item:any) => item.id === productId);
      if(index !== -1){
        car[index].count = countInput
        
        sessionStorage.setItem("car", JSON.stringify(car));
        const totalQuantity = car.reduce((total:number, item:any) => total + parseInt(item.count), 0);
        sessionStorage.setItem("totalQuantity", totalQuantity.toString());
        window.location.reload();
        this.ngxService.stop();
      }
    }
   
  }


validateCountInput(item:any,status:any){
  if(item > status || item<= 0){
    this.validCount = false
  }else{
    this.validCount = true
  }
}


obtenerProvincias(departamento: string) {
  const depto = this.departamentos.find(d => d.nombre === departamento);
  if (depto) {
    this.provincias = depto.provincias.map(p => p.nombre)
    this.distrito = [];
  } else {
    this.provincias = [];
    this.distrito = [];
  }
  this.departamento = departamento
}
obtenerDistritos(provincia: string) {
  const depto = this.departamentos.find(d => d.nombre === this.departamento);
  if (depto) {
      const provin = depto.provincias.find(p => p.nombre === provincia);
      if (provin) {
        this.distrito = provin.distritos
      } else {
          this.distrito = [];
      }
  } else {
      this.distrito = [];
  }
}

Submit(){
  var FormData = this.currierform.value;
  var data = {
    names: FormData.names,
    lastnames: FormData.lastnames,
    typeDocument: FormData.typeDocument,
    document: FormData.document,
    email:FormData.email,
    contactNumber:FormData.contactNumber,
    departamento:FormData.departamento,
    provincia:FormData.provincia,
    distrito:FormData.distrito
  }
  this.producService.sale(data).subscribe(
    (response:any)=>{
      this.CodeSale = response.id_sale
      this.listItemsCar?.map(product=>{
        var dataProduct={
          id_sale: this.CodeSale,
          product: product.name,
          count: product.count,
          price: product.price,
          image:product.image
        };
        this.producService.saleProduct(dataProduct).subscribe(
          (response:any)=>{
            sessionStorage.removeItem('car')
          },
          (err:any)=>{
            console.log(err)
          }
        )
      });
    },
    (err:any)=>{
      console.log(err)
    }
  );

}

}
