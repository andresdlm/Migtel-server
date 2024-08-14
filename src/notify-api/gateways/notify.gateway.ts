import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { io, Socket } from 'socket.io-client';
import config from 'src/config';

const origins = [
  'http://localhost:4200',
  'http://10.50.100.102',
  'https://omega.migtel.net.ve',
];

@WebSocketGateway({
  namespace: '/ws/notify',
  cors: {
    origin: origins, // Cambia esto al origen de tu frontend
    credentials: true,
  },
})
export class NotifyGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private socket: Socket;

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    this.socket = io(`${this.configService.notifyUrl}`, {
      withCredentials: true,
    });
    this.connect();
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendLog(object: any) {
    this.server.emit('log', object);
  }

  connect() {
    this.socket.on('connect', () => {
      console.log('WebSocket connection established');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket connection closed');
    });

    this.socket.on('log', (message: string) => {
      this.sendLog(message);
    });
  }
}
