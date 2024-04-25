import { Component, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { AuthService } from '../../../services/auth.service';
import { response } from 'express';
import { Global } from '../../../model/global';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.css'
})
export class ShoppingComponent implements OnInit {

  user:any = this.authService.getUser();
  sales:any=[]
  salesProduct:any=[]
  url:any = Global.apiUrl;
  totalPrice: any = 0;
  constructor(public  authService: AuthService
  ){

  }

  ngOnInit(): void {
    var data ={
      email: this.user.email
    }
    this.getSales(data)
  }

  getSales(data:any){
    this.authService.getSales(data).subscribe(
      response=>{
        this.sales = response
      },err=>{
        console.log(err)
      }
    )
  }

  getSaleProduct(id:any){
    let data = {id_sale: id}
    this.authService.getSalesProduct(data).subscribe(
      response=>{
        this.salesProduct = response
        this.totalPrice = this.salesProduct.reduce((sum:any,item:any)=>{
          return sum + (item.price*item.count);
        },0);
      },
      err=>{
        console.log(err)
      }
    )
  }

}
