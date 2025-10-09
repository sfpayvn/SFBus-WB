import { Environment } from './environment.model';

export class environment extends Environment {
  public override production: boolean = false;
  public override domain: string = 'sf-workbench.com'; // Thay đổi domain cho phù hợp với môi trường của bạn
}

export const ENV: Environment = new environment();
