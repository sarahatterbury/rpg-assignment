import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    // Client connected
  }

  handleDisconnect(client: Socket) {
    // Client disconnected
  }

  @SubscribeMessage('joinNotifications')
  handleJoinNotifications(client: Socket) {
    client.join('notifications');
  }

  notifyNewBlog(blogPost: any) {
    this.server.to('notifications').emit('newBlog', {
      id: blogPost.id.toString(),
      title: blogPost.title,
      author: blogPost.author.name,
      createdAt: blogPost.createdAt.toISOString(),
    });
  }
}
