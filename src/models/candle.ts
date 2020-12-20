import { Decimal } from 'decimal.js';
import { Period } from './period';
import { CandleData } from './interfaces';

export class Candle {
	public readonly high: Decimal;
	public readonly open: Decimal;
	public readonly close: Decimal;
	public readonly low: Decimal;
	public readonly volume: Decimal;
	public readonly time: number;
	public readonly period: Period;
	public readonly typical: Decimal;
	public readonly weightedClose: Decimal;
	public readonly median: Decimal;
	public readonly code: string;

	constructor(candleData: CandleData) {
		const { high, open, low, close, volume, period, typical, median, weightedClose, code, time } = candleData;
		this.high = new Decimal(high);
		this.open = new Decimal(open);
		this.close = new Decimal(close);
		this.low = new Decimal(low);
		this.volume = new Decimal(+volume);
		this.period = new Period(period);
		this.time = +time;
		this.typical = typical ? new Decimal(typical) : this.high.plus(this.low).plus(this.close).div(3);
		this.median = median ? new Decimal(median) : this.high.plus(this.low).div(2);
		this.weightedClose = weightedClose ? new Decimal(weightedClose) :
			this.high.plus(this.low).plus(this.close.mul(2)).div(4);
		this.code = code
	}

	get date(): string {
		return new Date(this.time).toLocaleString();
	}

	get mills(): number {
		const literal = this.period.symbol.slice(0, 1);
		const map = {
			M: 60000,
			H: 3600000,
			D: 86400000
		}
		const duration = +this.period.symbol.slice(1);
		return map[literal] * duration;
	}
}