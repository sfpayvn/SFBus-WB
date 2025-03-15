export class SearchBusScheduleAutoGenerator {
  busScheduleAutoGenerators: BusScheduleAutoGenerator[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}


export class specificTimeSlot {
  timeSlot: string = '';
}


export class BusScheduleAutoGenerator {
  _id: string = '';
  name: string = '';
  busScheduleTemplateId: string = '';
  repeatType: string = '';
  repeatInterval: number = 0;
  specificTimeSlots: specificTimeSlot[] = [];
  repeatDaysPerWeek: string[] = [];
  preGenerateDays: number = 0;
  startDate: number[] = [];
  endDate: number[] = [];
  selected: boolean = false;
}

export interface BusScheduleAutoGenerator2Create extends Omit<BusScheduleAutoGenerator, '_id' | 'selected'> { }
export class BusScheduleAutoGenerator2Create {
}

export class BusScheduleAutoGenerator2Update extends BusScheduleAutoGenerator2Create {
  _id: string = '';
}
