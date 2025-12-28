export abstract class Environment {
  public apiUrl: string = 'http://192.168.1.164:8080';
  public WEBSOCKET_URL: string = 'http://192.168.1.164:8080';
  // public apiUrl: string = 'https://ec2-3-86-143-34.compute-1.amazonaws.com';
  public production: boolean = false;
  public isWebApp: boolean = false;
  public firebase: any;

  public domain: string = 'sf-workbench.com'; // Thay đổi domain cho phù hợp với môi trường của bạn
}
