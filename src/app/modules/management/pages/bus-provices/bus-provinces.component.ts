import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusProvince, BusProvince2Create, SearchBusProvince } from './model/bus-province.model';
import { CreateEditBusProvinceDialogComponent } from './component/create-edit-bus-province-dialog/create-bus-province-dialog.component';
import { BusProvincesService } from './service/bus-provinces.servive';
import { BusStationsService } from '../bus-stations/service/bus-stations.servive';
import { combineLatest } from 'rxjs';
import { BusStation } from '../bus-stations/model/bus-station.model';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { Utils } from 'src/app/shared/utils/utils';

export interface filteredProvinces extends BusProvince {
  busStations: BusStation[],
};

@Component({
  selector: 'app-bus-provinces',
  templateUrl: './bus-provinces.component.html',
  styleUrls: ['./bus-provinces.component.scss'],
  standalone: false
})

export class BusProvincesComponent implements OnInit {
  searchBusProvince: SearchBusProvince = new SearchBusProvince();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBusProvince: boolean = false;

  busStations: BusStation[] = [];

  filteredProvinces: filteredProvinces[] = [];
  searchKeyword: string = "";
  timeout: any;

  constructor(
    private busProvincesService: BusProvincesService,
    private busStationsService: BusStationsService,
    private utilsModal: UtilsModal,
    private utils: Utils
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBusProvince = true;

    const searchBusProvince$ = this.busProvincesService.searchBusProvince(this.pageIdx, this.pageSize, this.keyword, this.sortBy);
    const searchBusStation$ = this.busStationsService.findAll();

    let request = [searchBusProvince$, searchBusStation$];

    combineLatest(request).subscribe(async ([searchBusProvinceRes, busStations]) => {
      this.searchBusProvince = searchBusProvinceRes;
      if (this.searchBusProvince && this.busStations) {
        this.totalItem = this.searchBusProvince.totalItem;
        this.totalPage = this.searchBusProvince.totalPage;
        this.busStations = busStations;
        this.filterProvinces();
      }
      this.isLoadingBusProvince = false;
    });

  }

  filterProvinces() {
    clearTimeout(this.timeout); // Xóa bộ hẹn giờ cũ (nếu có)
    this.timeout = setTimeout(() => {
      this.isLoadingBusProvince = true;
      const keyword = this.searchKeyword.toLowerCase();
      this.filteredProvinces = this.searchBusProvince.busProvinces
        .map((province) => {
          const matchingBusStations = this.busStations.filter(
            (busStation: any) => busStation.provinceId === province._id && busStation.name.toLowerCase().includes(keyword),
          );
          const remainingBusStations = this.busStations.filter(
            (busStation: any) => busStation.provinceId === province._id && !busStation.name.toLowerCase().includes(keyword),
          );
          return {
            ...province,
            busStations: [...matchingBusStations, ...remainingBusStations],
          };
        })
        .filter(
          (province) =>
            province.name.toLowerCase().includes(keyword) ||
            province.busStations.some((busStation: any) => busStation.name.toLowerCase().includes(keyword)),
        )
        .sort((a, b) => {
          const aMatches = a.name.toLowerCase().includes(keyword) ? -1 : 1;
          const bMatches = b.name.toLowerCase().includes(keyword) ? -1 : 1;
          return aMatches - bMatches;
        });
      this.isLoadingBusProvince = false;
      this.expandMatchingAccordions();
      console.log("🚀 ~ BusStationsComponent ~ this.timeout=setTimeout ~ this.filteredProvinces:", this.filteredProvinces)
    }, 300); // Trì hoãn tìm kiếm 300ms
  }

  expandMatchingAccordions() {
    // this.accordionGroups?.forEach((accordionGroup, index) => {
    //   const busStations = this.filteredProvinces[index].busStations;
    //   if (busStations.length > 0 && this.searchKeyword !== "") {
    //     accordionGroup.value = this.filteredProvinces[index]._id;
    //   } else {
    //     accordionGroup.value = "";
    //   }
    // });
  }

  toggleBusProvince(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusProvince.busProvinces = this.searchBusProvince.busProvinces.map((busProvince: BusProvince) => ({
      ...busProvince,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusProvince.busProvinces.some((busProvince) => !busProvince.selected);
  }

  deleteBusProvince(id: string): void {
    // const dialogRef = this.dialog.open(MaterialDialogComponent, {
    //   data: {
    //     icon: {
    //       type: 'dangerous'
    //     },
    //     title: 'Delete BusProvince',
    //     content:
    //       'Are you sure you want to delete this busProvince? All of your data will be permanently removed. This action cannot be undone.',
    //     btn: [
    //       {
    //         label: 'NO',
    //         type: 'cancel'
    //       },
    //       {
    //         label: 'YES',
    //         type: 'submit'
    //       },
    //     ]
    //   },
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.busProvincesService.deleteBusProvince(id).subscribe({
    //       next: (res: any) => {
    //         if (res) {
    //           this.searchBusProvince.busProvinces = this.searchBusProvince.busProvinces.filter((busProvince) => busProvince._id !== id);
    //           toast.success('BusProvince deleted successfully');
    //         }
    //       },
    //       error: (error: any) => this.utils.handleRequestError(error),
    //     });
    //   }
    // });
  }

  editBusProvince(busProvince: BusProvince): void {
    console.log("🚀 ~ BusProvincesComponent ~ editBusProvince ~ busProvince:", busProvince)
    const data = {
      title: 'Edit Bus Province',
      busProvince: { ...busProvince },
      busStations: this.busStations
    };
    this.utilsModal.openModal(CreateEditBusProvinceDialogComponent, data, 'medium').subscribe((result) => {
      if (result) {
        console.log("🚀 ~ BusProvincesComponent ~ this.utilsModal.openModal ~ result:", result)
        const updateBusProvince$ = this.busProvincesService.updateBusProvince(result.busProvince);
        const updateBusStations$ = this.busStationsService.updateBusStations(result.busStations2Update);

        let request = [updateBusProvince$, updateBusStations$];

        combineLatest(request).subscribe({
          next: ([updateBusProvinceRes, updateBusStationsRes]) => {
            if (updateBusProvinceRes && updateBusStationsRes) {
              this.loadData();
              toast.success('Cập nhập thành công ');
            }
          }, error: (error: any) => this.utils.handleRequestError(error),
        });

      }
    });
  }

  addBusProvince(): void {
    // const dialogRef = this.dialog.open(CreateEditBusProvinceDialogComponent, {
    //   data: {
    //     title: 'Add New BusProvince',
    //   },
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {

    //     const busProvince2Create = new BusProvince2Create();
    //     busProvince2Create.name = result.name;

    //     this.busProvincesService.createBusProvince(result.file, busProvince2Create).subscribe({
    //       next: (res: BusProvince) => {
    //         if (res) {
    //           this.loadData();
    //           toast.success('BusProvince added successfully');
    //         }
    //       },
    //       error: (error: any) => this.utils.handleRequestError(error),
    //     });
    //   }
    // });
  }

  reloadBusProvincePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusProvincePage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusProvincePage(sortBy: string) {
    this.sortBy = sortBy;
    this.loadData();
  }

  private handleRequestError(error: any): void {
    const msg = 'An error occurred while processing your request';
    toast.error(msg, {
      position: 'bottom-right',
      description: error.message || 'Please try again later',
      action: {
        label: 'Dismiss',
        onClick: () => { },
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }
}
