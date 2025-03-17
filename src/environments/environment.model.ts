export abstract class Environment {
  public apiUrl: string = 'http://192.168.1.164:8080';
  // public apiUrl: string = 'http://ec2-3-86-143-34.compute-1.amazonaws.com:443';
  public production: boolean = false;
  public isWebApp: boolean = false;
  public firebase: any;
}
