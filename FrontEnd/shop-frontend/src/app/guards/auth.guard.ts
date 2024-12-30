import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // First check if there's a token
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    if (route.routeConfig?.path === 'createproduct' || route.routeConfig?.path === 'connectedusers') {
      const userInfo = this.userService.getUserInfo();
      if (userInfo.role !== "Admin") {
        console.log("Not an admin, redirecting to home");
        this.router.navigate(['/home']);
        return false;
      }
    }
    if (route.routeConfig?.path === 'cart') {
      const userInfo = this.userService.getUserInfo();
      if (userInfo.role === "Admin") {
        console.log("Admin doesnt have cart");
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;
  }
}