import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { BusLayoutTemplate } from '../../modules/bus-management/pages/bus-layout-templates/model/bus-layout-templates.model';
import { SeatType } from '../../modules/bus-management/pages/seat-types/model/seat-type.model';

interface BusLayoutsMatrix extends BusLayoutTemplate {
  layoutsForMatrix: any;
}
@Component({
  selector: 'app-layout-matrix',
  templateUrl: './layout-matrix.component.html',
  styleUrls: ['./layout-matrix.component.scss'],
  standalone: false,
})
export class LayoutMatrixComponent implements OnInit {
  @Input() busLayoutsMatrix!: BusLayoutsMatrix;
  @Input() seatTypes!: SeatType[];
  @Input() busSeatLayoutBlockIds!: string[];
  @Input() isEditStatus: boolean = false;

  rows: number = 11; // Number of rows in the matrix
  cols: number = 7; // Number of columns in the matrix

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['busLayoutsMatrix'] && !changes['busLayoutsMatrix'].firstChange) {
      await this.initData();
    }
  }

  async initData() {
    this.busLayoutsMatrix.layoutsForMatrix = await this.initializeMatrix(
      this.busLayoutsMatrix.seatLayouts,
      this.busSeatLayoutBlockIds,
    );
    console.log(
      '🚀 ~ LayoutMatrixComponent ~ initData ~ this.busLayoutsMatrix.layoutsForMatrix:',
      this.busLayoutsMatrix.layoutsForMatrix,
    );
  }

  async initializeMatrix(seatLayouts: any, busSeatLayoutBlockIds?: string[]) {
    const layoutsForMatrix = await Promise.all(
      seatLayouts.map(async (seatLayout: any) => {
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
            status:
              busSeatLayoutBlockIds && busSeatLayoutBlockIds.includes(cell._id)
                ? 'blocked' // Mark as blocked if present in the IDs list
                : cell.status, // Default to available
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

        return layoutForMatrix;
      }),
    );

    return layoutsForMatrix;
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

  onClickToggleStatus(row: number, col: number, layoutForMatrix: any, event: MouseEvent): void {
    if (!this.isEditStatus) {
      return;
    }

    if (event.button !== 0) return;
    event.preventDefault();
    this.toggleStatus(row, col, layoutForMatrix, event);
  }

  toggleStatus(row: number, col: number, layoutForMatrix: any, event: MouseEvent): void {
    event.preventDefault(); // Ngăn chặn menu chuột phải mặc định
    const currentMatrix = layoutForMatrix.seatsLayoutForMatrix;
    const cell = currentMatrix[row][col];

    const currentCellSeatType = this.seatTypes.find((item) => item._id == cell.typeId);

    if (currentCellSeatType?.isEnv) {
      return;
    }

    // Remove the current status class
    const cellElement = this.el.nativeElement.querySelector(
      `#cell-${layoutForMatrix.name.replace(' ', '')}-${cell.index}`,
    );
    this.renderer.removeClass(cellElement, `status-${cell.status}`);

    //use for animation
    setTimeout(() => {
      if (cell.status === 'available') {
        cell.status = 'blocked';
      } else if (cell.status === 'blocked') {
        cell.status = 'available';
      }

      // Add the new status class
      this.renderer.addClass(cellElement, `status-${cell.status}`);
    }, 100); // Ensure the revert animation completes before applying the new status
  }

  getIconByType(cell: any) {
    // Tìm loại ghế tương ứng dựa trên type
    const selectedType = this.seatTypes.find((t) => t._id === cell.typeId);
    if (!selectedType) return '';
    return selectedType.icon;
  }
}
