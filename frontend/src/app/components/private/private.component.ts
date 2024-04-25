import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Global } from '../../model/global';
import { error } from 'console';
import { Product } from '../../model/product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-private',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './private.component.html',
  styleUrl: './private.component.css'
})
export class PrivateComponent implements OnInit{

  products : Product[]
  url : any

  constructor(
    private service: ProductService,
  ){
    this.products = [];
    this.url = Global.apiUrl

  }

  ngOnInit(): void {
    this.getProducts()
  }


  getProducts(){
    this.service.getComponents().subscribe(
      response=>{
        this.products= response
      },
      error=>{
        console.log(error)
      }
    )
  }
  

}
