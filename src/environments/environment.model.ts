export abstract class Environment {
  // public apiUrl: string = 'http://localhost:8080';
  public apiUrl: string = 'https://ec2-3-86-143-34.compute-1.amazonaws.com:443';
  public production: boolean = false;
  public isWebApp: boolean = false;
  public firebase: any;
}
