
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
    declarations: [
        LayoutComponent,
    ],
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        NavbarComponent,
        FooterComponent,
        ScrollingModule,
        LayoutRoutingModule
    ],
    exports: [
        LayoutComponent,
        // other components
    ]
})
export class LayoutModule { }
