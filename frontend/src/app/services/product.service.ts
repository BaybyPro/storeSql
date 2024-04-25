import { Injectable } from '@angular/core';
import { Global } from '../model/global';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private  URL : any
  constructor(
    private http: HttpClient
  ) { 
    this.URL = Global.apiUrl
  }


  getComponents(){
    return this.http.get<any>(this.URL+'/product/get');
  }

  addProduct(product:Product){
    return this.http.post<any>(this.URL+'/product/add',product)
  }

  getCompo(id:any){
    return this.http.get<any>(this.URL+'/product/getById/'+id)
  }

  getComposName(name:any){
    return this.http.get<any>(this.URL+'/product/getByName/'+name)
  }

  deleteCompo(id:any){
    return this.http.delete<any>(this.URL+'/product/delete/'+id)
  }
  updateCompo(compo:any){

    return this.http.patch<any>(this.URL+'/product/update/'+compo.id,compo)
   }

   addCategory(category:any){
    return this.http.post<any>(this.URL+'/category/add',category);
   }
  
  getCategory(){
    return this.http.get<any>(this.URL+'/category/get')
  }

  updateCategory(category:any){
    return this.http.patch<any>(this.URL+'/category/update',category)
  }

  deleteCategory(id:any){
    return this.http.delete<any>(this.URL+'/category/delete/'+id)
  }

  addDescription(description:any){
    return this.http.post<any>(this.URL+'/product/addDescription',description)
  }

  getDescription(description:any){
    return this.http.post<any>(this.URL+'/product/getDescription',description)
  }

  updateDescription(description:any){
    return this.http.patch(this.URL+'/product/updateDescription',description)
  }
  deleteDescription(id:any){
    return this.http.delete(this.URL+'/product/deleteDescription/'+id)
  }
  
  getFavorites(){
    return this.http.get<any>(this.URL+'/product/favorites')
  }

  getgetByCategory(categoryName:any){
    return this.http.get<any>(this.URL+'/product/getByCategory/'+categoryName)
  }

  sale(data:any){
    return this.http.post<any>(this.URL+"/user/sale",data)
  }

  saleProduct(data:any){
    return this.http.post<any>(this.URL+"/user/saleProduct",data)
  }
}
