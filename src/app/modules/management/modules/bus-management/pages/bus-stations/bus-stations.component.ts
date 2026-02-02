import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusStation, BusStation2Create, BusStation2Update, SearchBusStation } from './model/bus-station.model';
import { BusStationDetailDialogComponent } from './component/bus-station-detail-dialog/bus-station-detail-dialog.component';
import { BusStationsService } from './service/bus-stations.servive';
import { BusProvince } from '../bus-provices/model/bus-province.model';
import { BusProvincesService } from '../bus-provices/service/bus-provinces.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';

@Component({
  selector: 'app-bus-stations',
  templateUrl: './bus-stations.component.html',
  styleUrls: ['./bus-stations.component.scss'],
  standalone: false,
})
export class BusStationsComponent implements OnInit {
  searchBusStation: SearchBusStation = new SearchBusStation();

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

  constructor(
    private busStationsService: BusStationsService,
    private dialog: MatDialog,
    private utils: Utils,
    public defaultFlagService: DefaultFlagService,
    private utilsModal: UtilsModal,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    this.busStationsService.searchBusStation(this.searchParams).subscribe({
      next: (res: SearchBusStation) => {
        if (res) {
          this.searchBusStation = res;
          this.totalItem = this.searchBusStation.totalItem;
          this.totalPage = this.searchBusStation.totalPage;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoading = false;
      },
    });
  }

  onCurrentPageDataChange(event: any): void {
    const busStations = event as readonly BusStation[];
    this.searchBusStation.busStations = [...busStations];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBusStation.busStations;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBusStation.busStations.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteBusStation(busStation: BusStation): void {
    if (this.defaultFlagService.isDefault(busStation)) {
      return;
    }

    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete BusStation',
        content:
          'Are you sure you want to delete this busStation? All of your data will be permanently removed. This action cannot be undone.',
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
          this.busStationsService.deleteBusStation(busStation._id).subscribe({
            next: (res: any) => {
              if (res) {
                this.searchBusStation.busStations = this.searchBusStation.busStations.filter(
                  (b) => b._id !== busStation._id,
                );
                toast.success('BusStation deleted successfully');
              }
            },
            error: (error: any) => this.utils.handleRequestError(error),
          });
        } catch (err: any) {
          this.utils.handleRequestError(err.error);
        }
      }
    });
  }

  editBusStation(busStation: BusStation): void {
    const dialogRef = this.dialog.open(BusStationDetailDialogComponent, {
      data: {
        title: 'Edit BusStation',
        busStation: { ...busStation },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const busStation2UpdateFormDetail = result.busStation;

        const busStation2Update: BusStation2Update = {
          ...busStation,
          ...busStation2UpdateFormDetail,
        };

        const busStationImageFile: FileList = result.files;

        try {
          this.busStationsService.processUpdateBusStation(busStationImageFile, busStation2Update).subscribe({
            next: (res: BusStation) => {
              if (res) {
                this.searchBusStation.busStations = this.searchBusStation.busStations.map((busStation: BusStation) =>
                  busStation._id === res._id ? { ...busStation, ...res } : busStation,
                );
                toast.success('BusStation updated successfully');
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

  addBusStation(): void {
    const dialogRef = this.dialog.open(BusStationDetailDialogComponent, {
      data: {
        title: 'Add New BusStation',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const busStation2CreateFormDetail = result.busStation;

        const busStation2Create: BusStation2Create = {
          ...busStation2CreateFormDetail,
        };

        const busStationImageFile: FileList = result.files;

        try {
          this.busStationsService.processCreateBusStation(busStationImageFile, busStation2Create).subscribe({
            next: (res: BusStation) => {
              if (res) {
                this.loadData();
                toast.success('BusStation added successfully');
              }
            },
            error: (error: any) => this.utils.handleRequestError(error),
          });
        } catch (err: any) {
          this.utils.handleRequestError(err.error);
        }
      }
    });
  }

  cloneData(busStation: BusStation): void {
    delete (busStation as any)._id;
    let busStation2Create = new BusStation2Create();
    busStation2Create = { ...busStation2Create, ...busStation };

    this.busStationsService.createBusStation(busStation2Create).subscribe({
      next: (res: BusStation) => {
        if (res) {
          this.loadData();
          toast.success('Nhân bản thành công');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
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

  viewImage($event: any, image: string): void {
    $event.stopPropagation();
    this.utilsModal.viewImage($event, image);
  }
}
