import { Component, OnInit, inject } from '@angular/core';
import { DateUserComponent } from '../date-user/date-user.component';
import { ShoppingComponent } from '../shopping/shopping.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink,RouterOutlet,DateUserComponent,ShoppingComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  user:any = this.authService.getUser();
  constructor(public authService:AuthService){
  }

  ngOnInit(): void {
  }
}
