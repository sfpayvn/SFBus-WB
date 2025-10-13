import { BusService } from '../../bus-services/model/bus-service.model';
import { BusType } from '../../bus-types/model/bus-type.model';

export class SearchBusTemplate {
  busTemplates: BusTemplate[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class BusTemplate {
  _id: string = '';
  name: string = '';
  busServiceIds: string[] = [];
  busServices: BusService[] = [];
  busTypeId: string = '';
  busType: BusType | undefined;
  busLayoutTemplateId: string = '';
  selected: boolean = false;
}

export interface BusTemplate2Create extends Omit<BusTemplate, '_id' | 'selected'> {}
export class BusTemplate2Create {}

export class BusTemplate2Update extends BusTemplate2Create {
  _id: string = '';
}
