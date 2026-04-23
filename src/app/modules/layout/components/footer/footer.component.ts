import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { OrganizationService } from '@rsApp/core/services/organization.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [AsyncPipe],
})
export class FooterComponent implements OnInit {
  public year: number = new Date().getFullYear();
  title$ = this.organizationService.organizationName$;

  constructor(private organizationService: OrganizationService) {}

  ngOnInit(): void {
    // Organization name will be loaded and updated automatically
  }
}
