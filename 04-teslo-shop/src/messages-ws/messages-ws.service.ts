import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
	[id: string]: {
		socket: Socket;
		user: User;
	};
}

@Injectable()
export class MessagesWsService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	) {}

	private connectedClients: ConnectedClients = {};

	async registerClient(client: Socket, userId: string) {
		const user = await this.userRepository.findOneBy({ id: userId });
		if (!user) {
			throw new Error('User not found');
		}
		if (!user.isActive) {
			throw new Error('User is not active');
		}

		this.checkIfUserIsConnected(user);

		this.connectedClients[client.id] = {
			socket: client,
			user,
		};
	}

	removeClient(clientId: string) {
		delete this.connectedClients[clientId];
	}

	getConnectedClients(): string[] {
		return Object.keys(this.connectedClients).map(
			(id) => this.connectedClients[id].user.fullName,
		);
	}

	getUserFullNameBySocketId(socketId: string): string {
		return this.connectedClients[socketId].user.fullName;
	}

	private checkIfUserIsConnected(user: User) {
		Object.keys(this.connectedClients).forEach((id) => {
			if (this.connectedClients[id].user.id === user.id) {
				this.connectedClients[id].socket.disconnect();
			}
		});
	}
}
