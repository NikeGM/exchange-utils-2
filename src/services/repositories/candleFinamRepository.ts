'use strict';
import * as http from 'http';
import { FinamUrlParametersList } from './interfaces';
import { UploadCandlesFinam } from '../api/routes/uploadCandlesFinam';
import { Candle } from '../../models';

export class CandleFinamRepository {
	public async loadFinamCandles(params: UploadCandlesFinam): Promise<Candle[]> {
		const finamUrlParameters = this.getLoadCandlesParams(params);
		const file = await this.loadCandlesFile(finamUrlParameters);
		// console.log(file);
		return this.convertToCandles(file, params);
	}

	private loadCandlesFile(params: FinamUrlParametersList): Promise<string> {
		return new Promise((res, rej) => {
			const {
				code, e, market, em, p, yf, yt, month_start, day_start, month_end, day_end, dtf, tmf, MSOR, mstimever, sep, sep2,
				datf, at, year_start, year_end, mf, mt, df, dt,
			} = params;

			http.get(
				`http://export.finam.ru/${code}_${year_start}${month_start}${day_start}_${day_start}${month_end}${day_end}${e}?market=${market}&em=${em}&code=${code}&apply=0&df=${df}&mf=${mf}&yf=${yf}&from=${day_start}.${month_start}.${yf}&dt=${dt}&mt=${mt}&yt=${yt}&to=${day_end}.${month_end}.${yt}&p=${p}&f=${code}_${year_start}${month_start}${day_start}_${year_end}${month_end}${day_end}&e=${e}&cn=${code}&dtf=${dtf}&tmf=${tmf}&MSOR=${MSOR}&mstimever=${mstimever}&sep=${sep}&sep2=${sep2}&datf=${datf}&at=${at}`,
				response => {
					let result = '';
					response.on('data', (chunk) => (result += chunk.toString()));
					response.on('end', () => res(result));
					response.on('error', rej);
				}
			)
		})

	}

	private getLoadCandlesParams(params: UploadCandlesFinam): FinamUrlParametersList {
		const { start, end, code, period, finamCode } = params;
		const dateStart = new Date(+start);
		const dateEnd = new Date(+end);
		const defaultOptions =
			{
				e: '.txt',
				market: 1,
				dtf: 4,
				tmf: 3,
				MSOR: 0,
				mstimever: 0,
				sep: 1,
				sep2: 0,
				datf: 1,
				at: 0,
				p: this.finamPeriodMap(period),
				em: +finamCode,
			}
		return {
			...defaultOptions,
			yf: dateStart.getFullYear(),
			yt: dateEnd.getFullYear(),
			mf: dateStart.getMonth(),
			mt: dateEnd.getMonth(),
			df: dateStart.getDate() - 1,
			dt: dateEnd.getDate() - 1,
			year_start: dateStart.getFullYear().toString().slice(2),
			year_end: dateEnd.getFullYear().toString().slice(2),
			month_start: (dateStart.getMonth() + 1).toString().padStart(2, '0'),
			month_end: (dateEnd.getMonth() + 1).toString().padStart(2, '0'),
			day_start: dateStart.getDate().toString().padStart(2, '0'),
			day_end: dateEnd.getDate().toString().padStart(2, '0'),
			code
		}
	}

	private finamPeriodMap(period: string): number {
		const map = {
			M1: 2,
			M5: 3,
			M10: 4,
			M15: 5,
			M30: 6,
			H1: 7,
			D1: 8,
			W: 9
		}
		return map[period.toUpperCase()];
	}

	private convertToCandles(file: string, params: UploadCandlesFinam): Candle[] {
		const lines = file.split('\n').filter((line, index, arr) => {
			if (!line.length) {
				console.log('Empty line', arr.length, index + 1)
			}
			return !!line.length;
		})
		return lines.map(line => {
			const { period, code } = params;
			const [, , date, time, open, high, low, close, volume] = line.split(',');
			const [day, month, year] = date.split('/');
			const [hours, minutes, seconds] = time.split(':');
			const dateObject = new Date(`20${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000+03:00`);

			return new Candle({
				high, open, close, low, volume, period, code,
				time: dateObject.getTime()
			})
		})
	}
}