import { Component, OnInit } from '@angular/core';
import { Bus, Bus2Create, Bus2Update } from '../../model/bus.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common'
import { BusService } from '../../../bus-services/model/bus-service.model';
import { BusServicesService } from '../../../bus-services/service/bus-services.servive';
import { combineLatest } from 'rxjs';
import { BusType } from '../../../bus-types/model/bus-type.model';
import { BusTypesService } from '../../../bus-types/service/bus-types.servive';
import { BusTemplatesService } from '../../../bus-templates/service/bus-templates.servive';
import { BusTemplate } from '../../../bus-templates/model/bus-template.model';
import { SeatType } from '../../../seat-types/model/seat-type.model';
import { SeatTypesService } from '../../../seat-types/service/seat-types.servive';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { BusesService } from '../../service/buses.servive';

interface BusTemplateWithLayoutsMatrix extends BusTemplate {
  layoutsForMatrix: any;
}
@Component({
  selector: 'app-bus-detail',
  templateUrl: './bus-detail.component.html',
  styleUrl: './bus-detail.component.scss',
  standalone: false
})
export class BusDetailComponent implements OnInit {

  busDetailForm!: FormGroup;

  busServices: BusService[] = [];
  busTypes: BusType[] = [];
  busTemplates: BusTemplate[] = [];
  seatTypes: SeatType[] = [];

  busTemplateReview!: BusTemplateWithLayoutsMatrix;

  rows: number = 11; // Number of rows in the matrix
  cols: number = 7; // Number of columns in the matrix

  bus!: Bus;

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private location: Location,
    private busServicesService: BusServicesService,
    private busTypesService: BusTypesService,
    private busTemplatesService: BusTemplatesService,
    private seatTypesService: SeatTypesService,
    private busesService: BusesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }


  async getQueryParams() {
    const params = history.state;
    if (params) {
      this.bus = params["bus"] ? JSON.parse(params["bus"]) : null;
    }
  }

  initData() {
    let findAllBusService = this.busServicesService.findAll();
    let findAllBusType = this.busTypesService.findAll();
    let findAllBusTemplate = this.busTemplatesService.findAll();
    let findAllSeatType = this.seatTypesService.findAll();

    let request = [findAllBusService, findAllBusType, findAllBusTemplate, findAllSeatType];

    combineLatest(request).subscribe(async ([busServices, busTypes, busTemplates, seatTypes]) => {
      this.busServices = busServices;
      this.busTypes = busTypes;
      this.busTemplates = busTemplates;
      this.seatTypes = seatTypes;
      this.initForm();
    });
  }

  private async initForm() {
    this.busDetailForm = this.fb.group({
      name: [this.bus?.name ?? '', [Validators.required]],
      licensePlate: [this.bus?.licensePlate ?? '', [Validators.required]],
      busServiceIds: [this.bus?.busServiceIds ?? [], [Validators.required]],
      busTypeId: [this.bus?.busTypeId ?? '', [Validators.required]],
      busTemplateId: [this.bus?.busTemplateId ?? '', [Validators.required]],
    });


    if (this.busDetailForm.get('busTemplateId')?.value) {
      this.chooseBusTemplate(this.busDetailForm.get('busTemplateId')?.value);
    }
  }

  async chooseBusTemplate(busTemplateId: string) {
    this.busTemplateReview = this.busTemplates.find((busTemplate: BusTemplate) => busTemplate._id === busTemplateId) as BusTemplateWithLayoutsMatrix;
    this.busTemplateReview.layoutsForMatrix = [];

    await this.initializeMatrix(this.busTemplateReview.seatLayouts, this.busTemplateReview.layoutsForMatrix, (layouts) => {
      this.busTemplateReview.layoutsForMatrix = layouts;
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
            _id: "",
            index: i * this.cols + j + 1,
            typeId: "",
            name: "",
            status: "available",
            statusChanged: false,
            statusDeselected: false,
          })),
        ),
      };

      for (const cell of seatLayout.seats) {
        const row = Math.floor((cell.index - 1) / this.cols);
        const col = (cell.index - 1) % this.cols;
        layoutForMatrix.seatsLayoutForMatrix[row][col] = {
          ...cell,
          statusChanged: false,
          statusDeselected: false,
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
    if (!selectedType) return "";

    // Trả về icon tương ứng dựa trên trạng thái của ghế
    if (cell.status === "selected") {
      return selectedType.selectedIcon
    } else if (cell.status === "block" || cell.status === "booked") {
      return selectedType.blockIcon
    }
    return selectedType.icon
  }

  backPage() {
    this.location.back();
  }

  editBusTempate() {

    const allowedKeys = ["_id", "name", "seatLayouts"]; // Danh sách các thuộc tính trong BusTemplate
    const combinedBusTemplate: BusTemplate = Object.fromEntries(
      Object.entries(this.busTemplateReview).filter(([key]) => allowedKeys.includes(key))
    ) as BusTemplate;

    // Chuyển đổi đối tượng busTemplate thành chuỗi JSON
    const params = { busTemplate: JSON.stringify(combinedBusTemplate) };

    // Điều hướng đến trang chi tiết của bus template
    this.router.navigateByUrl('/management/bus-templates/bus-template-detail', { state: params });
  }


  onSubmit() {
    if (!this.busDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busDetailForm);
      return;
    }

    const data = this.busDetailForm.getRawValue();
    const bus2Create: Bus2Create = {
      ...data
    }

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
          toast.success('Bus added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}
