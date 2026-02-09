import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CapsService } from '@rsApp/shared/services/caps.service';

@Injectable({
  providedIn: 'root',
})
export class ModuleBlockGuard implements CanActivate {
  private capsService = inject(CapsService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Extract moduleKey từ route
    // Ví dụ: 'management/auto-schedule' => 'auto-schedule'
    const moduleKey = this.extractModuleKeyFromRoute(route);
    
    if (moduleKey && this.capsService.isBlocked(moduleKey)) {
      // Nếu module bị block => redirect to 404
      this.router.navigate(['/errors/404']);
      return false;
    }

    return true;
  }

  /** Extract moduleKey từ route */
  private extractModuleKeyFromRoute(route: ActivatedRouteSnapshot): string | null {
    // Lấy path từ route: route.component.name hoặc route.data
    // Cách 1: Từ data route (nếu config trong routing)
    if (route.data && route.data['moduleKey']) {
      return route.data['moduleKey'];
    }

    // Cách 2: Extract từ path
    // route.url là mảng UrlSegment[], ta lấy phần tử cuối
    if (route.url && route.url.length > 0) {
      return route.url[route.url.length - 1].path;
    }

    // Cách 3: Extract từ full path
    const fullPath = this.getFullPath(route);
    const parts = fullPath.split('/').filter((p) => p);
    // Giả sử module key là phần cuối: 'management/auto-schedule' => 'auto-schedule'
    return parts.length >= 2 ? parts[parts.length - 1] : null;
  }

  /** Get full path từ route hierarchy */
  private getFullPath(route: ActivatedRouteSnapshot): string {
    let path = '';
    let current: ActivatedRouteSnapshot | null = route;
    const segments: string[] = [];

    while (current) {
      if (current.url.length > 0) {
        segments.unshift(...current.url.map((u) => u.path));
      }
      current = current.parent;
    }

    return '/' + segments.join('/');
  }
}
