import { Decimal } from 'decimal.js';
import { Period } from './period';

export interface CandleData {
	high: string|Decimal;
	volume: string|Decimal;
	open: string|Decimal;
	close: string|Decimal;
	low: string|Decimal;
	typical?: string|Decimal;
	weightedClose?: string|Decimal;
	median?: string|Decimal;
	time: string|number;
	period: string|Period;
	code: string;
}