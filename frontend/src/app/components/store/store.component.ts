import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';
import { ProductService } from '../../services/product.service';
import { response } from 'express';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RouterLink } from '@angular/router';
declare const $: any
import { register } from 'swiper/element/bundle';
import { Global } from '../../model/global';
import { FooderComponent } from '../fooder/fooder.component';
import { ProductSale } from '../../model/productSale';
import { count } from 'console';
import { AuthService } from '../../services/auth.service';
register();

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [RouterLink, FooderComponent],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StoreComponent implements OnInit {

  products?: [{ id: 0, name: "", price: 9999, status: 0, image: '', discount: 0, discountedPrice: 0, categoryId: 0, categoryName: '' }]
  categorys?: [{ id: 0, name: "" }]
  url: any = Global.apiUrl
  countProduct: Number | undefined
  constructor(private producService: ProductService,
    private authService: AuthService) {

  }

  ngOnInit(): void {

    this.getFavorites();
    $(function () {
      $('.bxslider').bxSlider({
        auto: true,
        autoControls: true,
        captions: true,
        pager: true,
        slideWidth: 2000
      });
    });

  }

  getFavorites() {
    this.producService.getFavorites().subscribe(
      (response) => {
        this.products = response.map((product: any) => {
          const price = parseFloat(product.price);
          const discount = parseFloat(product.discount);
          const discountedPrice = Math.floor(price - (price * (discount / 100)));
          return { ...product, discountedPrice };
        })
      }, (err) => {
        console.log(err)

      }
    )
  }

  getCateorys() {
    this.producService.getCategory().subscribe(
      (response) => {
        this.categorys = response
        console.log(this.categorys)
      },
      (err) => {
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
