import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpClientModule } from '@angular/common/http'
import { User } from '../model/model';
import {BehaviorSubject, Observable,of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../model/decoded';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private URL = 'http://127.0.0.1:8080'

  

  constructor(
    private http: HttpClient,
    private router : Router
  ) {}

  signUp(user:any){
    
    return this.http.post<any>(this.URL+'/signup',user)
    /* const conflictError = new HttpErrorResponse({
      error:'Usuario ya registrado',
      status: 409,
      statusText:'conflicto'
    });
    return throwError(conflictError) */
  }

  signIn(user:any){

    return this.http.post<any>(this.URL+'/signin',user)

    /* const conflictError = new HttpErrorResponse({
      error:'user invalid',
      status: 404,
      statusText:'conflicto'
    });
    return throwError(conflictError) */
  }

  loggedIn() {
    
      return !!localStorage.getItem('token');
  }

  AuthRole(): boolean {
    const token: string | null = localStorage.getItem('token');
  
    if (!token) {
      return false;
    }
  
    try {
      const { email, role }: any = jwtDecode(token);
  
      if (role !== 'admin') {
        return false;
      }
  
      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  getUser(){
    const token: any = localStorage.getItem('token');

    if (token) {
        const { name, email, role, contactNumber,nombres,apellidos,points }: any = jwtDecode(token);
        return { name, email, role, contactNumber,nombres,apellidos,points };
    } else {
        // Manejo en caso de que no haya un token en el localStorage
        return console.log('no hay');
    }

  }
  
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      this.router.navigate(['/signin']);
    }
  }
  
  gettoken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  public isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/']);
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  getCount(){
    const countString = sessionStorage.getItem("totalQuantity") ;
    const count = countString ? parseInt(countString) : 0;
    return count
    
  }

 private countIconSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
countIcon$: Observable<number> = this.countIconSubject.asObservable();

  updateCountIcon(count: number) {
    this.countIconSubject.next(count);
  }

  updateUser(data:any){
    return this.http.patch<any>(this.URL+"/user/updateDate",data)
  }
  
  getSales(data:any){
    return this.http.post<any>(this.URL+"/user/getSale",data)
  }

  getSalesProduct(data:any){
    return this.http.post<any>(this.URL+"/user/getSaleProduct",data)
  }
}
