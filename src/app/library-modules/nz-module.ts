import { NgModule } from "@angular/core";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzTreeViewModule } from "ng-zorro-antd/tree-view";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { NzAutocompleteModule } from "ng-zorro-antd/auto-complete";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzPopoverModule } from "ng-zorro-antd/popover";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzModalModule } from "ng-zorro-antd/modal";
import { EyeInvisibleOutline } from "@ant-design/icons-angular/icons";
import { NzAffixModule } from "ng-zorro-antd/affix";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzCarouselModule } from "ng-zorro-antd/carousel";
import { NzQRCodeModule } from "ng-zorro-antd/qr-code";
import { NzSkeletonModule } from "ng-zorro-antd/skeleton";
@NgModule({
  imports: [NzIconModule.forRoot([EyeInvisibleOutline])],
  exports: [
    NzSelectModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzTreeViewModule,
    NzPipesModule,
    NzAutocompleteModule,
    NzDropDownModule,
    NzTabsModule,
    NzButtonModule,
    NzToolTipModule,
    NzInputModule,
    NzFormModule,
    NzPopoverModule,
    NzRadioModule,
    NzModalModule,
    NzIconModule,
    NzAffixModule,
    NzDividerModule,
    NzSpinModule,
    NzDatePickerModule,
    NzTableModule,
    NzCollapseModule,
    NzCarouselModule,
    NzQRCodeModule,
    NzSkeletonModule,
  ],
})
export class NZModule {}
