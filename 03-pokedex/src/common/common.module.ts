import { Module } from '@nestjs/common';
import { FecthAdapter } from './adapters/fetch.adapter';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
	providers: [FecthAdapter, AxiosAdapter],
	exports: [FecthAdapter, AxiosAdapter],
})
export class CommonModule {}
