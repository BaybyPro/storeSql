import { Routes } from '@angular/router';
import { StoreComponent } from './components/store/store.component';
import { CreateComponent } from './components/create/create.component';
import { PrivateComponent } from './components/private/private.component';
import { tokenGuard } from './services/token.guard';
import { DetailsComponent } from './components/details/details.component';
import { EditComponent } from './components/edit/edit.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProductosComponent } from './components/sale/productos/productos.component';
import { roleGuard } from './guards/role.guard';
import { SearchComponent } from './components/search/search.component';
import { CarComponent } from './components/sale/car/car.component';
import { UserComponent } from './components/profile/user/user.component';
import path from 'path';
import { DateUserComponent } from './components/profile/date-user/date-user.component';
import { ShoppingComponent } from './components/profile/shopping/shopping.component';


export const routes: Routes = [
    {path:'',component:StoreComponent},
    {path:'store',component:StoreComponent},
    {path:'private',component:PrivateComponent, canMatch :[tokenGuard]},
    {path:'detail/:id',component:DetailsComponent,canMatch :[tokenGuard]},
    {path:'edit/:id',component:EditComponent,canMatch:[tokenGuard]},
    {path:'create',component:CreateComponent,canActivate:[roleGuard], data:{expectedRole:'admin'}},
    {path:'category',component:CategoryComponent,canActivate:[roleGuard], data:{expectedRole:'admin'}},
    {path:'categorias/:category',component:CategoriasComponent},
    {path:'search/:name',component:SearchComponent},
    {path:'products/:id',component:ProductosComponent},
    {path:'carrito',component:CarComponent},
    {path:'user',component:UserComponent,children:
        [{path:'date',component:DateUserComponent},
         {path:'shopping',component:ShoppingComponent}
        ]},
    {path:'**',component:StoreComponent}
];
