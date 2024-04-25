import { Component, OnInit } from '@angular/core';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { RouterLink, Params, Router, ActivatedRoute } from '@angular/router';
import { Global } from '../../model/global';
import { ProductService } from '../../services/product.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from '../../services/auth.service';
import { ProductSale } from '../../model/productSale';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatPaginatorModule,RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{
  products?:[{id:0,name:"",price:9999,status:0,image:'',discount:0,discountedPrice:0,categoryId:0,categoryName:''}]
  url:any= Global.apiUrl;
  searchTitle?: string;

  constructor(
    private service: ProductService,
    private router: ActivatedRoute,
    private ngxService:NgxUiLoaderService,
    private authService:AuthService){}

  ngOnInit(): void {
    this.router.params.subscribe(
      (params:any)=>{
        let productName = params['name'];
        this.ngxService.start();
        this.searchTitle = productName
        this.getProduct(productName);
      }
    )
  }

  getProduct(name:any){
    this.service.getComposName(name).subscribe(
      (response)=>{
        this.ngxService.stop();
        this.products = response.map((product:any)=>{
          const price = parseFloat(product.price);
          const discount = parseFloat(product.discount);
          const discountedPrice = Math.floor(price - (price * (discount / 100)));
          return { ...product, discountedPrice };
        })
      },(err)=>{
        this.ngxService.stop();
        console.log(err)
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
