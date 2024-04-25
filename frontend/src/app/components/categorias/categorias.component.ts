import { Component, Inject, OnInit } from '@angular/core';
import { Product } from '../../model/product';
import { Global } from '../../model/global';
import { ProductService } from '../../services/product.service';
import { RouterLink, Params, Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FooderComponent } from '../fooder/fooder.component';
import { ProductSale } from '../../model/productSale';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterLink,FooderComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit{
  products?:[{id:0,name:"",price:9999,status:0,image:'',discount:0,discountedPrice:0,categoryId:0,categoryName:''}]
  url : any
  categotyTitle?: string

  
  constructor(
    private service: ProductService,
    private router: ActivatedRoute,
    private ngxService:NgxUiLoaderService,
    private authService:AuthService,
  ){
    
    this.url = Global.apiUrl

  }

  ngOnInit(): void {
    this.router.params.subscribe(
      (params:any)=>{
        let categoryName = params['category']
        this.categotyTitle = categoryName
        this.ngxService.start();
        this.getProducts(categoryName)
      }
    )
  }


  getProducts(name:any){
    this.service.getgetByCategory(name).subscribe(
      response=>{
        this.ngxService.stop();
        this.products = response.map((product:any)=>{
          const price = parseFloat(product.price);
          const discount = parseFloat(product.discount);
          const discountedPrice = Math.floor(price - (price * (discount / 100)));
          return { ...product, discountedPrice };
        })
        
      },
      error=>{
        this.ngxService.stop();
        console.log(error)
      }
    )
  }

  addCard(product: any) {
    let car: ProductSale[] = JSON.parse(sessionStorage.getItem("car") || '[]');
    const index = car.findIndex(item => item.id === product.id);
    if (index !== -1) {
      // Si el producto ya está en el carrito, aumentar la cantidad si es menor que el estado del producto
      if (car[index].count < product.status) {
        car[index].count++;
      }
    } else {
      // Si el producto no está en el carrito, agregarlo
      let productSale: ProductSale | any = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        discountedPrice: product.discountedPrice,
        status: product.status,
        count: 1
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
