import { Router } from 'express';
import { asyncMiddleware } from '../../utils/asyncMiddleware';
import { CandleFinamRepository } from '../../repositories/candle-finam-repository';
import { CandleRepository } from '../../repositories/candle-repository';
import { IRoute } from '../../interfaces';
import { UploadCandlesFinam } from './interfaces';

export class UploadCandlesFinamRoute implements IRoute {
	private readonly route: Router = Router();

	constructor(
		private readonly candleFinamRepository: CandleFinamRepository,
		private readonly candleRepository: CandleRepository
	) {
		this.route.get(
			'/',
			asyncMiddleware(async (req, res) => {
				const { period, code } = req.query;
				console.log(`Upload finam candles. Query params: ${JSON.stringify(req.query)}`);
				if (!period || !code) {
					res.status(200).json(0)
					return;
				}
				const result = await this.controller({ ...req.query });

				res.status(200).json(result);
			})
		);
	}

	public async controller(params: UploadCandlesFinam): Promise<boolean> {
		const candles = await this.candleFinamRepository.loadFinamCandles(params);
		await this.candleRepository.deleteCandleType(params.period, params.code);
		return this.candleRepository.saveCandles(candles);
	}

	public get router(): Router {
		return this.route;
	}
}
