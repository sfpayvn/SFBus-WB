/**
 * DIRECTIVES MODULE
 * 
 * Import này nếu sử dụng module-based architecture
 * Nếu standalone component, import trực tiếp AuthorizedDirective
 */

import { NgModule } from '@angular/core';
import { AuthorizedDirective } from './authorized.directive';

/**
 * Module for non-standalone components
 * Use this if your component is NOT standalone
 * 
 * For standalone components, import AuthorizedDirective directly:
 * imports: [AuthorizedDirective]
 */
@NgModule({
  imports: [AuthorizedDirective],
  exports: [AuthorizedDirective],
})
export class DirectivesModule {}

/**
 * USAGE:
 * 
 * 1. Standalone Component (Recommended):
 * 
 * import { AuthorizedDirective } from '@rsApp/core/directives/authorized.directive';
 * 
 * @Component({
 *   imports: [AuthorizedDirective]
 * })
 * 
 * 
 * 2. Module-based Component:
 * 
 * import { DirectivesModule } from '@rsApp/core/directives/directives.module';
 * 
 * @NgModule({
 *   imports: [DirectivesModule]
 * })
 */
