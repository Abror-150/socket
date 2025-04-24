import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { Server } from 'socket.io';
@WebSocketGateway()
export class ChatGatAway {
  @WebSocketServer()
  server: Server;

  private users = new Map();
  handleDisconnect(client: Socket) {
    let uid;
    this.users.forEach((x, y) => {
      if (x == client.id) {
        uid = y;
      }
    });
    this.users.delete(uid);
  }
  @SubscribeMessage('register')
  handleRegister(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    let uid = data.userId;
    let sid = client.id;
    this.users.set(uid, sid);
  }
  @SubscribeMessage('private')
  privateChat(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    let uid = data.userId;
    let sId = this.users.get(uid);
    this.server.to(sId).emit('habar', data);
  }
  @SubscribeMessage('globalChat')
  handleGlobalmessage(@MessageBody() data: string) {
    this.server.emit('global', data);
  }
  @SubscribeMessage('join')
  joinGroup(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.join(data.group);
  }
  @SubscribeMessage('groupMessage')
  handleGroupMessage(@MessageBody() data: { group: string; message: string }) {
    this.server.to(data.group).emit('name', data.message);
  }
}
