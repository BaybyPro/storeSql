import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Global } from '../../../model/global';
import { Product } from '../../../model/product';
import { ProductService } from '../../../services/product.service';
import { MatIconModule } from '@angular/material/icon';
import { Console } from 'console';
import { ProductDiscount } from '../../../model/discount';
import { FormsModule } from '@angular/forms';
import { FooderComponent } from '../../fooder/fooder.component';
import { ProductSale } from '../../../model/productSale';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterLink,MatIconModule,FormsModule,FooderComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent  implements OnInit{

  url:any= Global.apiUrl
  compo:any = ProductDiscount
  discount?:number
  cantidad:number = 1
  selectedImage: string | null = null;
  descriptions:any = [{id:0,description:''}];
  constructor(private routeActivate : ActivatedRoute,
    private service : ProductService,
    private authService: AuthService){

  }

  ngOnInit(): void {
    this.routeActivate.params.subscribe(
      params=>{
        let id = params['id']
        this.getCompo(id)
        this.getDescription({ product_id: id })
      }
    )
  }

  getCompo(id:any){
    this.service.getCompo(id).subscribe(
      (response)=>{
        this.compo = response;
        this.discount = Math.floor(response.price-(response.price*(response.discount/100)))
        this.selectedImage = response.image
      },(err)=>{
        console.log(err)
        
      }
    )
  }

  getDescription(id:any){
    this.service.getDescription(id).subscribe(
    (response:any)=>{
          this.descriptions = response.map((items:any)=>{
            const splitDescription = items.description.split(':')
            return{
              key:splitDescription[0],
              value:splitDescription[1]
            };
          });

    },(err:any)=>{
      console.log(err)
    }
    )
  }

  

  showImage(image: string) {
    this.selectedImage = image;
  }

  addCard(product: any,precio:any,cantidad:number) {
    console.log(cantidad)
    let car: ProductSale[] = JSON.parse(sessionStorage.getItem("car") || '[]');
    const index = car.findIndex(item => item.id === product.id);
    if (index !== -1) {
      // Si el producto ya está en el carrito, aumentar la cantidad si es menor que el estado del producto
      if (car[index].count < product.status) {
        car[index].count= cantidad;
      }
    } else {
      // Si el producto no está en el carrito, agregarlo
      let productSale: ProductSale | any = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        discountedPrice: precio,
        status: product.status,
        count: cantidad
      };
      car.push(productSale);
    }
    // Calcular la suma de las cantidades de todos los productos en el carrito
    const totalQuantity = car.reduce((total, item) => total + item.count, 0);
    // Calcular la suma de las cantidades de todos los productos en el carrito
    // Almacenar el carrito actualizado y la cantidad total en sessionStorage
    sessionStorage.setItem("car", JSON.stringify(car));
    sessionStorage.setItem("totalQuantity", totalQuantity.toString());
    this.authService.updateCountIcon(totalQuantity);
  }
}
