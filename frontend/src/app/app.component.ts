import { Component,OnInit,HostListener } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DialogConfig } from '@angular/cdk/dialog';
import { SigninComponent } from './components/signin/signin.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { Router } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { NgxUiLoaderModule ,NgxUiLoaderConfig,SPINNER,PB_DIRECTION } from 'ngx-ui-loader';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { ProductService } from './services/product.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FooderComponent } from './components/fooder/fooder.component';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,MatMenuModule,MatButtonModule,NgxUiLoaderModule,MatSidenavModule,MatIcon,MatAutocompleteModule,FooderComponent,MatBadgeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  public screenWidth : number;
  user:any = this.authService.getUser();
  categorys:any = [];
  countIcon: any;
  

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.screenWidth = window.innerWidth;

    
  } 
  constructor (
    private dialog : MatDialog,
    private _service: ProductService,
    public authService: AuthService,
    private router: Router){


      this.screenWidth = window.innerWidth;
    }
  title = 'Pro Compu';

  ngOnInit(): void {
    this.getCategorys()
    this.authService.updateCountIcon(this.authService.getCount());
    this.countIcon = this.authService.getCount();
    this.authService.countIcon$.subscribe(count=>{
      this.countIcon = count
    })
  }

  signin(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width="550px";
    dialogConfig.minHeight="200px";
    this.dialog.open(SigninComponent,dialogConfig) 
    
  }

  navigateToSearch(searchValue: string) {
    if (searchValue.trim() !== '') {
        this.router.navigate(['/search', searchValue]);
    }
}
  

  getCategorys(){
    this._service.getCategory().subscribe(
      (response)=>{
      this.categorys = response
      },(err)=>{
        console.log(err)
      }
    )
  }

  
}