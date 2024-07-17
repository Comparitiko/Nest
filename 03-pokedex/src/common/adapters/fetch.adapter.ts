import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

@Injectable()
export class FecthAdapter implements HttpAdapter {
	async get<T>(url: string): Promise<T> {
		try {
			const res = await fetch(url);

			if (!res.ok) throw new Error('Something went wrong');

			const data = await res.json();
			return data;
		} catch (error) {
			throw new Error('Something went wrong');
		}
	}
}
