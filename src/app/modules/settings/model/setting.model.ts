export class Setting {
  name: string = '';

  value: string = '';

  description?: string;

  groupName?: string;
}

export interface SettingDto {
  name: string;
  value: string;
  description?: string;
  groupName?: string;
}
