import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { CreateproductComponent } from './components/createproduct/createproduct.component';
import { ConnectedUsersComponent } from './components/connectedusers/connectedusers.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'createproduct', component: CreateproductComponent, canActivate: [AuthGuard] },
  { path: 'connectedusers', component: ConnectedUsersComponent, canActivate: [AuthGuard] }
];