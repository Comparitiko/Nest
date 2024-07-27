import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() wsServer: Server;

	constructor(
		private readonly messagesWsService: MessagesWsService,
		private readonly jwtService: JwtService,
	) {}

	async handleConnection(client: Socket) {
		const token = client.handshake.headers.authentication as string;

		if (!token) {
			client.disconnect();
			return;
		}

		let payload: JwtPayload;

		try {
			payload = this.jwtService.verify(token);
			await this.messagesWsService.registerClient(client, payload.id);
		} catch (error) {
			client.disconnect();
			return;
		}

		this.wsServer.emit(
			'clients-updated',
			this.messagesWsService.getConnectedClients(),
		);
	}
	handleDisconnect(client: Socket) {
		this.messagesWsService.removeClient(client.id);

		this.wsServer.emit(
			'clients-updated',
			this.messagesWsService.getConnectedClients(),
		);
	}

	@SubscribeMessage('message-from-client')
	async handleMessageFromClient(client: Socket, data: NewMessageDto) {
		// Enviar solo al cliente que envió el mensaje
		//client.emit('message-from-server', data);

		// Enviar a todos los clientes conectados menos al que envió el mensaje
		// client.broadcast.emit('message-from-server', data);

		// Enviar a todos los clientes conectados
		this.wsServer.emit('message-from-server', {
			fullName: this.messagesWsService.getUserFullNameBySocketId(client.id),
			message: data.message,
		});
	}
}
