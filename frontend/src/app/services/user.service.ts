import { Injectable } from '@angular/core';
import { Global } from '../model/global';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = Global.apiUrl;
  constructor(private httpClient:HttpClient) { }

  signup(data:any){
    return this.httpClient.post<any>(this.url+'/user/signup',data);
  }

  fogotPassword(data:any){
    return this.httpClient.post<any>(this.url+'/user/forgotPassword',data)
  }

  login(data:any){
    return this.httpClient.post<any>(this.url+'/user/login',data)
  }

  checkToken(){
    return this.httpClient.get(this.url+"/user/checktoken")
  }
  
  changePassword(data:any){
    return this.httpClient.post<any>(this.url+"/user/changePasswprd",data)
  }
}
