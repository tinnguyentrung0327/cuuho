import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    return { event: 'joinedRoom', data: room };
  }

  @SubscribeMessage('updateLocation')
  handleLocationUpdate(@MessageBody() data: { userId: string; lat: number; lng: number }) {
    this.server.emit('locationUpdated', data);
    return data;
  }

  // Method to broadcast events from other services
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
