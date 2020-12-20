import { DbCandleType } from './interfaces';
import { DB_TABLES } from '../api';
import { Candle } from '../../models';
import Knex = require('knex');

export class CandleRepository {
	private readonly table: DB_TABLES = DB_TABLES.CANDLES;
	private readonly batchSize: number = 5000;

	constructor(private readonly client: Knex) {
	}

	public async saveCandles(candles: Candle[]): Promise<boolean> {
		const batch = [];
		while (candles.length) {
			while (batch.length < this.batchSize && candles.length) {
				batch.push(candles.pop())
			}
			const result = await this.saveCandlesBatch(batch);
			batch.length = 0;
			console.log(result.length);
		}
		return true;
	};

	public deleteCandleType(period: string, code: string): Promise<number> {
		console.log(`Delete candles. Period: ${period}, code: ${code}`);
		return this.client(this.table).where({period, code}).delete().catch(console.log) as Promise<number>;
	}

	private saveCandlesBatch(candles: Candle[]): Promise<string[]> {
		const prepared = candles.map(this.prepareCandle);
		return this.client.insert(prepared, ['id']).into(this.table).catch(console.log) as Promise<string[]>
	};

	private prepareCandle(candle: Candle): DbCandleType {
		const { name, code, time, date, open, high, low, close, volume, median, typical, weightedClose, period } = candle;
		return {
			name, code, date,
			time: time.toString(),
			open: +open,
			high: +high,
			low: +low,
			close: +close,
			volume: +volume,
			median: +median,
			typical: +typical,
			weighted_close: +weightedClose,
			period: period.symbol
		}
	}
}