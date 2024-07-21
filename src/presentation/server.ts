import express, { Router } from 'express';

interface Options {
  port: number;
  routes: Router;
}

export class Server {

  // TODO verificar si funciona como privada el app
  private readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly routes: Router;

  constructor( options: Options ) {
    const { port, routes } = options;

    this.port = port;
    this.routes = routes;
  }

  async start() {
    this.app.use( express.json() );
    this.app.use( express.urlencoded( { extended: true } ) );

    this.app.use( this.routes );

    this.serverListener = this.app.listen( this.port, () => console.log( `Server running on port ${ this.port }` ) );
  }

  public close() {
    this.serverListener?.close();
  }

}