import { Component, OnInit } from '@angular/core';
import { BusTemplate, BusTemplate2Create, BusTemplate2Update } from '../../model/bus-template.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common'
import { BusService } from '../../../bus-services/model/bus-service.model';
import { BusServicesService } from '../../../bus-services/service/bus-services.servive';
import { combineLatest } from 'rxjs';
import { BusType } from '../../../bus-types/model/bus-type.model';
import { BusTypesService } from '../../../bus-types/service/bus-types.servive';
import { SeatType } from '../../../seat-types/model/seat-type.model';
import { SeatTypesService } from '../../../seat-types/service/seat-types.servive';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { BusTemplatesService } from '../../service/bus-templates.servive';
import { BusLayoutTemplate } from '../../../bus-layout-templates/model/bus-layout-templates.model';
import { BusLayoutTemplatesService } from '../../../bus-layout-templates/service/bus-layout-templates.servive';

interface BusTemplateWithLayoutsMatrix extends BusLayoutTemplate {
  layoutsForMatrix: any;
}
@Component({
  selector: 'app-bus-template-detail',
  templateUrl: './bus-template-detail.component.html',
  styleUrl: './bus-template-detail.component.scss',
  standalone: false
})
export class BusTemplateDetailComponent implements OnInit {

  busTemplateDetailForm!: FormGroup;

  busServices: BusService[] = [];
  busTypes: BusType[] = [];
  busLayoutTemplates: BusLayoutTemplate[] = [];
  seatTypes: SeatType[] = [];

  busLayoutTemplateReview!: BusTemplateWithLayoutsMatrix;

  rows: number = 11; // Number of rows in the matrix
  cols: number = 7; // Number of columns in the matrix

  busTemplate!: BusTemplate;

  constructor(
    private fb: FormBuilder,
    private utils: Utils,
    private location: Location,
    private busServicesService: BusServicesService,
    private busTypesService: BusTypesService,
    private busLayoutTemplatesService: BusLayoutTemplatesService,
    private seatTypesService: SeatTypesService,
    private busTemplatesService: BusTemplatesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.initData();
  }


  async getQueryParams() {
    const params = history.state;
    if (params) {
      this.busTemplate = params["busTemplate"] ? JSON.parse(params["busTemplate"]) : null;
    }
  }

  initData() {
    let findAllBusService = this.busServicesService.findAll();
    let findAllBusType = this.busTypesService.findAll();
    let findAllBusTemplate = this.busLayoutTemplatesService.findAll();
    let findAllSeatType = this.seatTypesService.findAll();

    let request = [findAllBusService, findAllBusType, findAllBusTemplate, findAllSeatType];

    combineLatest(request).subscribe(async ([busServices, busTypes, busLayoutTemplates, seatTypes]) => {
      this.busServices = busServices;
      this.busTypes = busTypes;
      this.busLayoutTemplates = busLayoutTemplates;
      this.seatTypes = seatTypes;
      this.initForm();
    });
  }

  private async initForm() {

    const { name = '', busServiceIds = [], busTypeId = '', busLayoutTemplateId = '' } = this.busTemplate || {};

    this.busTemplateDetailForm = this.fb.group({
      name: [name, [Validators.required]],
      busServiceIds: [busServiceIds ?? [], [Validators.required]],
      busTypeId: [busTypeId, [Validators.required]],
      busLayoutTemplateId: [busLayoutTemplateId, [Validators.required]],
    });


    if (this.busTemplateDetailForm.get('busLayoutTemplateId')?.value) {
      this.chooseBusTemplate(this.busTemplateDetailForm.get('busLayoutTemplateId')?.value);
    }
  }

  async chooseBusTemplate(busLayoutTemplateId: string) {
    this.busLayoutTemplateReview = this.busLayoutTemplates.find((busLayoutTemplate: BusLayoutTemplate) => busLayoutTemplate._id === busLayoutTemplateId) as BusTemplateWithLayoutsMatrix;
    this.busLayoutTemplateReview.layoutsForMatrix = [];

    await this.initializeMatrix(this.busLayoutTemplateReview.seatLayouts, this.busLayoutTemplateReview.layoutsForMatrix, (layouts) => {
      this.busLayoutTemplateReview.layoutsForMatrix = layouts;
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
    const combinedBusTemplate: BusLayoutTemplate = Object.fromEntries(
      Object.entries(this.busLayoutTemplateReview).filter(([key]) => allowedKeys.includes(key))
    ) as BusLayoutTemplate;

    // Chuyển đổi đối tượng busTemplate thành chuỗi JSON
    const params = { busTemplate: JSON.stringify(combinedBusTemplate) };

    // Điều hướng đến trang chi tiết của bus template
    this.router.navigateByUrl('/management/bus-layout-templates/bus-layout-template-detail', { state: params });
  }


  onSubmit() {
    if (!this.busTemplateDetailForm.valid) {
      this.utils.markFormGroupTouched(this.busTemplateDetailForm);
      return;
    }

    const data = this.busTemplateDetailForm.getRawValue();
    const busTemplate2Create: BusTemplate2Create = {
      ...data
    }

    if (this.busTemplate) {
      const busTemplate2Update = {
        ...busTemplate2Create,
        _id: this.busTemplate._id, // Thêm thuộc tính _id
      };

      this.updateBusTemplate(busTemplate2Update);
      return;
    }

    this.createBusTemplate(busTemplate2Create);
  }

  updateBusTemplate(busTemplate2Update: BusTemplate2Update) {
    this.busTemplatesService.updateBusTemplate(busTemplate2Update).subscribe({
      next: (res: BusTemplate) => {
        if (res) {
          const updatedState = { ...history.state, busTemplate: JSON.stringify(res) };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success('Bus update successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  createBusTemplate(busTemplate2Create: BusTemplate2Create) {
    this.busTemplatesService.createBusTemplate(busTemplate2Create).subscribe({
      next: (res: BusTemplate) => {
        if (res) {
          toast.success('Bus added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}
