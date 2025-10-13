export class SearchBusScheduleAutoGenerator {
  busScheduleAutoGenerators: BusScheduleAutoGenerator[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class SpecificTimeSlot {
  _id: string = '';
  timeSlot: string = '';
}

export class BusScheduleAutoGenerator {
  _id: string = '';
  name: string = '';
  busScheduleTemplateId: string = '';
  repeatType: 'days' | 'weeks' = 'days';
  repeatInterval: number = 0;
  specificTimeSlots: SpecificTimeSlot[] = [];
  repeatDaysPerWeek: string[] = [];
  preGenerateDays: number = 0;
  startDate: Date = new Date();
  endDate: Date | any;
  selected: boolean = false;
}

export interface SpecificTimeSlot2Create extends Omit<SpecificTimeSlot, '_id'> {}
export class SpecificTimeSlot2Create {}

export interface BusScheduleAutoGenerator2Create
  extends Omit<BusScheduleAutoGenerator, '_id' | 'selected' | 'specificTimeSlots'> {}
export class BusScheduleAutoGenerator2Create {
  specificTimeSlots: SpecificTimeSlot2Create[] = [];
}

export class BusScheduleAutoGenerator2Update extends BusScheduleAutoGenerator2Create {
  _id: string = '';
}
