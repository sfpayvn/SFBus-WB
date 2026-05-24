export abstract class Environment {
  //public apiUrl: string = 'http://192.168.1.164:8080';
  //public apiUrl: string = 'http://localhost:8080';  
  //public WEBSOCKET_URL: string = 'http://localhost:8080';  
  public WEBSOCKET_ENABLE: boolean = false;
  public apiUrl: string = "https://project-qic5f.vercel.app";
  public WEBSOCKET_URL: string = "https://project-qic5f.vercel.app";
  public production: boolean = false;
  public isWebApp: boolean = false;
  public firebase: any;
  public domain: string = 'sf-workbench.com'; // Thay đổi domain cho phù hợp với môi trường của bạn
}
