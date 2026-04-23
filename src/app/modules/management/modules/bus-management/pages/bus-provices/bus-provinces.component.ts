import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusProvince, BusProvince2Create, CloneBusProvince, SearchBusProvince } from './model/bus-province.model';
import { BusProvinceDetailDialogComponent } from './component/bus-province-detail-dialog/bus-province-detail-dialog.component';
import { BusProvincesService } from './service/bus-provinces.servive';
import { BusStationsService } from '../bus-stations/service/bus-stations.servive';
import { catchError, combineLatest, EMPTY, finalize, forkJoin, of, take } from 'rxjs';
import { BusStation } from '../bus-stations/model/bus-station.model';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { Utils } from 'src/app/shared/utils/utils';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import { TranslateService } from '@ngx-translate/core';

export interface filteredProvinces extends BusProvince {
  busStations: BusStation[];
}

@Component({
  selector: 'app-bus-provinces',
  templateUrl: './bus-provinces.component.html',
  styleUrls: ['./bus-provinces.component.scss'],
  standalone: false,
})
export class BusProvincesComponent implements OnInit {
  searchBusProvince: SearchBusProvince = new SearchBusProvince();

  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  totalPage: number = 0;
  totalItem: number = 0;

  searchParams = {
    pageIdx: 1,
    pageSize: 5,
    keyword: '',
    sortBy: {
      key: 'createdAt',
      value: 'descend',
    },
    filters: [] as any[],
  };

  isLoading: boolean = false;

  filteredProvinces: filteredProvinces[] = [];
  searchKeyword: string = '';
  timeout: any;

  constructor(
    private busProvincesService: BusProvincesService,
    private busStationsService: BusStationsService,
    private utilsModal: UtilsModal,
    private utils: Utils,
    private dialog: MatDialog,
    public defaultFlagService: DefaultFlagService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    const searchBusProvince$ = this.busProvincesService.searchBusProvince(this.searchParams);

    let request = [searchBusProvince$];

    combineLatest(request).subscribe(async ([searchBusProvinceRes]) => {
      this.searchBusProvince = searchBusProvinceRes;
      if (this.searchBusProvince) {
        this.totalItem = this.searchBusProvince.totalItem;
        this.totalPage = this.searchBusProvince.totalPage;
        this.filterProvinces();
      }
      this.isLoading = false;
    });
  }

  filterProvinces() {
    clearTimeout(this.timeout); // Xóa bộ hẹn giờ cũ (nếu có)
    this.timeout = setTimeout(() => {
      this.isLoading = true;
      const keyword = this.searchKeyword.toLowerCase();
      this.filteredProvinces = this.searchBusProvince.busProvinces
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
      this.isLoading = false;
      this.expandMatchingAccordions();
      console.log(
        '🚀 ~ BusStationsComponent ~ this.timeout=setTimeout ~ this.filteredProvinces:',
        this.filteredProvinces,
      );
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

  onCurrentPageDataChange(event: any): void {
    const provinces = event as readonly filteredProvinces[];
    this.filteredProvinces = [...provinces];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.filteredProvinces;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.filteredProvinces.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(_id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(_id);
    } else {
      this.setOfCheckedId.delete(_id);
    }
  }

  onItemChecked(_id: string, checked: boolean): void {
    this.updateCheckedSet(_id, checked);
    this.refreshCheckedStatus();
  }

  deleteBusProvince(busProvince: BusProvince): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete BusProvince',
        content:
          'Are you sure you want to delete this busProvince? All of your data will be permanently removed. This action cannot be undone.',
        btn: [
          {
            label: 'NO',
            type: 'cancel',
          },
          {
            label: 'YES',
            type: 'submit',
          },
        ],
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        try {
          this.busProvincesService.deleteBusProvince(busProvince._id).subscribe({
            next: (res: any) => {
              if (res) {
                this.searchBusProvince.busProvinces = this.searchBusProvince.busProvinces.filter(
                  (bp) => bp._id !== busProvince._id,
                );
                this.filterProvinces();
                toast.success(this.translate.instant('messages.provinceDeletedSuccess'));
              }
            },
            error: (err: any) => this.utils.handleRequestError(err.error),
          });
        } catch (err: any) {
          this.utils.handleRequestError(err.error);
        }
      }
    });
  }

  editBusProvince(busProvince: BusProvince): void {
    const data = {
      title: 'Chỉnh sửa Tỉnh/Thành Phố',
      busProvince: { ...busProvince },
    };
    this.utilsModal.openModal(BusProvinceDetailDialogComponent, data, 'medium').subscribe((result) => {
      if (result) {
        const requests = [];
        if (result.busProvince) {
          requests.push(this.busProvincesService.updateBusProvince(result.busProvince));
        }
        if (result.busStations2Update) {
          requests.push(this.busStationsService.updateBusStations(result.busStations2Update));
        }

        // nếu không có request nào thì không làm gì và không thông báo
        if (requests.length === 0) {
          return;
        }

        try {
          forkJoin(requests)
            .pipe(
              take(1),
              catchError((err: any) => {
                this.utils.handleRequestError(err.error);
                // trả về EMPTY để luồng hoàn thành mà không ném lỗi lên subscribe
                return EMPTY;
              }),
              finalize(() => {}),
            )
            .subscribe((responses: any[]) => {
              // kiểm tra xem có ít nhất 1 response là "hợp lệ" (thay predicate nếu cần)
              const anyUpdated = responses.some((r) => !!r);

              if (anyUpdated) {
                this.loadData();
                toast.success(this.translate.instant('messages.updateSuccess'));
              }
              // nếu none -> không thông báo gì
            });
        } catch (err: any) {
          this.utils.handleRequestError(err.error);
        }
      }
    });
  }

  addBusProvince(): void {
    const data = {
      title: 'Thêm Tỉnh/Thành Phố',
    };

    this.utilsModal.openModal(BusProvinceDetailDialogComponent, data, 'medium').subscribe((result) => {
      if (result) {
        const busProvince2Create = new BusProvince2Create();
        busProvince2Create.name = result.busProvince.name;
        try {
          this.busProvincesService.createBusProvince(busProvince2Create).subscribe({
            next: (res: BusProvince) => {
              if (res) {
                this.loadData();
                toast.success(this.translate.instant('messages.provinceAddedSuccess'));
              }
            },
            error: (err: any) => this.utils.handleRequestError(err.error),
          });
        } catch (err: any) {
          this.utils.handleRequestError(err.error);
        }
      }
    });
  }

  cloneData(busProvince: BusProvince): void {
    let busProvince2Create = new BusProvince2Create();
    busProvince2Create = { ...busProvince2Create, ...busProvince };

    const cloneBusProvince: CloneBusProvince = {
      busProvince: busProvince2Create,
      busStations: busProvince.busStations || [],
    };

    try {
      this.busProvincesService.cloneBusProvince(cloneBusProvince).subscribe({
        next: (res: BusProvince) => {
          if (res) {
            this.loadData();
            toast.success(this.translate.instant('messages.clonedSuccess'));
          }
        },
        error: (err: any) => this.utils.handleRequestError(err.error),
      });
    } catch (err: any) {
      this.utils.handleRequestError(err.error);
    }
  }

  reloadPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadData();
  }

  searchPage(keyword: string) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword,
    };
  }

  sortPage(sortBy: { key: string; value: string }) {
    this.searchParams = {
      ...this.searchParams,
      sortBy,
    };
    this.loadData();
  }
}
