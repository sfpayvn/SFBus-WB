import { Component, OnInit } from '@angular/core';
import { Bus, Bus2Create, Bus2Update } from '../../model/bus.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { BusService } from '../../../bus-services/model/bus-service.model';
import { BusServicesService } from '../../../bus-services/service/bus-services.servive';
import { combineLatest } from 'rxjs';
import { BusType } from '../../../bus-types/model/bus-type.model';
import { BusTypesService } from '../../../bus-types/service/bus-types.servive';
import { SeatType } from '../../../seat-types/model/seat-type.model';
import { SeatTypesService } from '../../../seat-types/service/seat-types.servive';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { BusesService } from '../../service/buses.servive';
import { BusLayoutTemplate } from '../../../bus-layout-templates/model/bus-layout-templates.model';
import { BusLayoutTemplatesService } from '../../../bus-layout-templates/service/bus-layout-templates.servive';
import { BusTemplate } from '../../../bus-templates/model/bus-template.model';
import { BusTemplatesService } from '../../../bus-templates/service/bus-templates.servive';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';

interface BusLayoutTemplateWithLayoutsMatrix extends BusLayoutTemplate {
  layoutsForMatrix: any;
}

interface BusTemplateReview extends BusTemplate {
  busServices: BusService[];
  busType: BusType;
  isLoading: boolean;
}

@Component({
  selector: 'app-bus-detail',
  templateUrl: './bus-detail.component.html',
  styleUrl: './bus-detail.component.scss',
  standalone: false,
})
export class BusDetailComponent implements OnInit {
  busDetailForm!: FormGroup;

  busServices: BusService[] = [];
  busTypes: BusType[] = [];
  busLayoutTemplates: BusLayoutTemplate[] = [];

  seatTypes: SeatType[] = [];

  busTemplates: BusTemplate[] = [];

  busTemplateReview!: BusTemplateReview;
  busLayoutTemplateReview!: BusLayoutTemplateWithLayoutsMatrix;

  rows: number = 11; // Number of rows in the matrix
  cols: number = 7; // Number of columns in the matrix

  bus!: Bus;

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private location: Location,
    private busServicesService: BusServicesService,
    private busTypesService: BusTypesService,
    private busLayoutTemplatesService: BusLayoutTemplatesService,
    private seatTypesService: SeatTypesService,
    private busesService: BusesService,
    private busTemplatesService: BusTemplatesService,
    private router: Router,
    public defaultFlagService: DefaultFlagService,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }

  async getQueryParams() {
    const params = history.state;
    if (params) {
      this.bus = params['bus'] ? JSON.parse(params['bus']) : null;
    }
  }

  initData() {
    let findAllBusService = this.busServicesService.findAll();
    let findAllBusType = this.busTypesService.findAll();
    let findAllBusLayoutTemplate = this.busLayoutTemplatesService.findAll();
    let findAllSeatType = this.seatTypesService.findAll();
    let findAllBusTemplate = this.busTemplatesService.findAll();

    let request = [findAllBusService, findAllBusType, findAllBusLayoutTemplate, findAllSeatType, findAllBusTemplate];

    combineLatest(request).subscribe(async ([busServices, busTypes, busLayoutTemplates, seatTypes, busTemplates]) => {
      this.busServices = busServices;
      this.busTypes = busTypes;
      this.busLayoutTemplates = busLayoutTemplates;
      this.seatTypes = seatTypes;
      this.busTemplates = busTemplates;
      this.initForm();
    });
  }

  private async initForm() {
    const { name = '', licensePlate = '', busTemplateId = '' } = this.bus || {};

    this.busDetailForm = this.fb.group({
      name: [name, [Validators.required]],
      licensePlate: [licensePlate, [Validators.required]],
      busTemplateId: [busTemplateId, [Validators.required]],
    });

    if (busTemplateId) {
      this.chooseBusTemplate(busTemplateId);
    }
  }

  async chooseBusTemplate(busTemplateId: string) {
    const busTemplate = this.busTemplates.find(
      (busTemplate: BusTemplate) => busTemplate._id === busTemplateId,
    ) as BusTemplate;
    this.busTemplateReview = busTemplate as BusTemplateReview;
    this.busTemplateReview.isLoading = true;

    //setup matrix layout template
    this.busLayoutTemplateReview = this.busLayoutTemplates.find(
      (busLayoutTemplate: BusLayoutTemplate) => busLayoutTemplate._id === busTemplate.busLayoutTemplateId,
    ) as BusLayoutTemplateWithLayoutsMatrix;
    this.busLayoutTemplateReview.layoutsForMatrix = [];

    await this.initializeMatrix(
      this.busLayoutTemplateReview.seatLayouts,
      this.busLayoutTemplateReview.layoutsForMatrix,
      (layouts) => {
        this.busLayoutTemplateReview.layoutsForMatrix = layouts;
      },
    );

    //setup service and type for bus review
    let findAllBusServices = this.busServicesService.findAll();
    let findBusTypeById = this.busTypesService.findOne(this.busTemplateReview.busTypeId, true);
    const request = [findAllBusServices, findBusTypeById];
    combineLatest(request).subscribe(async ([busServices, busType]) => {
      const serviceOfBus = busServices.filter((service: BusService) =>
        this.busTemplateReview.busServiceIds.includes(service._id),
      );
      this.busTemplateReview.busServices = serviceOfBus;
      this.busTemplateReview.busType = busType;
      this.busTemplateReview.isLoading = false;
    });
  }

  async initializeMatrix(seatLayouts: any, layoutsForMatrix: any, out: (layoutsForMatrix: any) => void): Promise<void> {
    for (const seatLayout of seatLayouts) {
      const layoutForMatrix = {
        name: seatLayout.name,
        seatDisplayRows: [],
        seatVisibleColumns: [],
        seatsLayoutForMatrix: Array.from({ length: this.rows }, (_, i) =>
          Array.from({ length: this.cols }, (_, j) => ({
            _id: '',
            index: i * this.cols + j + 1,
            typeId: '',
            name: '',
            status: 'available',
          })),
        ),
      };

      for (const cell of seatLayout.seats) {
        const row = Math.floor((cell.index - 1) / this.cols);
        const col = (cell.index - 1) % this.cols;
        layoutForMatrix.seatsLayoutForMatrix[row][col] = {
          ...cell,
          icon: this.getIconByType(cell),
        };
      }

      await this.updateDisplayMatrix(
        layoutForMatrix.seatsLayoutForMatrix,
        layoutForMatrix.seatDisplayRows,
        layoutForMatrix.seatVisibleColumns,
        (matrix, displayRows, visibleColumns) => {
          layoutForMatrix.seatsLayoutForMatrix = matrix;
          layoutForMatrix.seatDisplayRows = displayRows;
          layoutForMatrix.seatVisibleColumns = visibleColumns;
        },
      );

      layoutsForMatrix.push(layoutForMatrix);
    }
    await out(layoutsForMatrix);
  }

  async updateDisplayMatrix(
    matrix: any,
    displayRows: any,
    visibleColumns: any,
    out: (matrixOut: any, displayRowsOut: any, visibleColumnsOut: any) => void,
  ): Promise<void> {
    const rows = matrix.length;
    const cols = matrix[0].length;

    displayRows = Array(rows).fill(false);
    visibleColumns = Array(cols).fill(false);
    const selectedColumns: number[] = [];
    const selectedRows = new Set<number>();

    matrix.forEach((row: any, i: number) => {
      row.forEach((cell: any, j: number) => {
        if (cell.typeId) {
          displayRows[i] = true;
          selectedColumns.push(j);
          selectedRows.add(i);
        }
      });
    });

    const selectedRowsArray = Array.from(selectedRows).sort((a, b) => a - b);
    selectedRowsArray.forEach((row, index, array) => {
      for (let i = row; i <= array[array.length - 1]; i++) {
        displayRows[i] = true;
      }
    });

    if (selectedColumns.length > 0) {
      selectedColumns.sort((a, b) => a - b);
      const [firstCol, lastCol] = [selectedColumns[0], selectedColumns[selectedColumns.length - 1]];
      for (let j = firstCol; j <= lastCol; j++) {
        visibleColumns[j] = true;
      }
    }

    out(matrix, displayRows, visibleColumns);
  }

  getIconByType(cell: any) {
    // Tìm loại ghế tương ứng dựa trên type
    const selectedType = this.seatTypes.find((t) => t._id === cell.typeId);
    if (!selectedType) return '';
    return selectedType.icon;
  }

  backPage() {
    this.location.back();
  }

  editBusTemplate() {
    const busTemplate = this.busTemplates.find(
      (busTemplate: BusTemplate) => busTemplate._id === this.busTemplateReview._id,
    ) as BusTemplate;
    // Chuyển đổi đối tượng busTemplate thành chuỗi JSON
    const params = { busTemplate: JSON.stringify(busTemplate) };

    // Điều hướng đến trang chi tiết của bus template
    this.router.navigateByUrl('/management/bus-management/bus-design/bus-templates/bus-template-detail', { state: params });
  }

  editBusLayoutTemplate() {
    const busLayoutTemplate = this.busLayoutTemplates.find(
      (busLayoutTemplate: BusLayoutTemplate) => busLayoutTemplate._id === this.busLayoutTemplateReview._id,
    ) as BusLayoutTemplate;

    // Chuyển đổi đối tượng busTemplate thành chuỗi JSON
    const params = { busLayoutTemplate: JSON.stringify(busLayoutTemplate) };

    // Điều hướng đến trang chi tiết của bus template
    this.router.navigateByUrl('/management/bus-management/bus-design/bus-layout-templates/bus-layout-template-detail', {
      state: params,
    });
  }

  onSubmit() {
    if (!this.busDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busDetailForm);
      return;
    }

    const data = this.busDetailForm.getRawValue();
    const bus2Create: Bus2Create = {
      ...data,
    };

    if (this.bus) {
      const bus2Update = {
        ...bus2Create,
        _id: this.bus._id, // Thêm thuộc tính _id
      };

      this.updateBus(bus2Update);
      return;
    }

    this.createBus(bus2Create);
  }

  updateBus(bus2Update: Bus2Update) {
    this.busesService.updateBus(bus2Update).subscribe({
      next: (res: Bus) => {
        if (res) {
          const updatedState = { ...history.state, bus: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success('Bus update successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  createBus(bus2Create: Bus2Create) {
    this.busesService.createBus(bus2Create).subscribe({
      next: (res: Bus) => {
        if (res) {
          this.bus = res;
          const updatedState = { ...history.state, bus: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          this.initForm();
          toast.success('Bus added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}
