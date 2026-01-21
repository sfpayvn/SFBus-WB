export abstract class Environment {
  //public apiUrl: string = 'http://192.168.1.164:8080';
  //public apiUrl: string = 'http://localhost:8080';  
  public apiUrl: string = 'http://ec2-3-86-143-34.compute-1.amazonaws.com:8000';
  public production: boolean = false;
  public isWebApp: boolean = false;
  public firebase: any;
  public domain: string = 'sf-workbench.com'; // Thay đổi domain cho phù hợp với môi trường của bạn
}
