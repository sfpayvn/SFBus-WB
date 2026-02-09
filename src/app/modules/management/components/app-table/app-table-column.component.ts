import { Component, Input, TemplateRef, ContentChild } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-table-column",
  template: "",
  standalone: true,
  imports: [CommonModule],
})
export class AppTableColumnComponent {
  @Input() key: string = "";
  @Input() label: string = "";
  @Input() widthPx?: number;
  @Input() sticky?: "left" | "right";
  @ContentChild(TemplateRef, { static: true }) template?: TemplateRef<any>;
}
