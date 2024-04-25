import { HttpInterceptorFn } from '@angular/common/http';
import { error } from 'console';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

 const authService = inject(AuthService)
 const token = localStorage.getItem('token');

 if(token){
  let decodedToken = jwtDecode(token);
  const isExpired= decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;

  if(isExpired){
    console.log('token expired');
    localStorage.removeItem('token');
  }
  
 }

 const authReq = req.clone({
  headers: req.headers.set('Authorization',`Bearer ${token}`),
});


 return next(authReq)

};
