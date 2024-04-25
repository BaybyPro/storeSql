import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { MyJwtPayload } from '../model/decoded';

export const roleGuard: CanActivateFn = (route, state) => {

  const service = inject(AuthService)
  const router = inject(Router)
  const token:any = localStorage.getItem('token')
  const expectedRole = route.data['expectedRole']

  const { email, role}:any = jwtDecode(token)

  if( role !== expectedRole){
    return false
  }else{
    return true;
  }

  
};
