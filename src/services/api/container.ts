import Knex from 'knex';
import config from 'config';
import { Api } from './api';
import { UploadCandlesFinamRoute } from './routes/uploadCandlesFinam';
import { ClientApiContainer } from './interfaces';
import Bottle from 'bottlejs';
import { CandleFinamRepository, CandleRepository } from '../repositories';

export const getClientApiContainer = () => {
	const bottle = new Bottle();
	bottle.factory('api', (container: ClientApiContainer) => new Api(container.routes));
	bottle.factory('dbClient', () =>
		Knex({
			client: 'pg',
			connection: config.db.postgres
		}),
	);
	bottle.factory(
		'candleRepository',
		(container: ClientApiContainer) => new CandleRepository(container.dbClient)
	);
	bottle.factory(
		'candleFinamRepository',
		() => new CandleFinamRepository()
	);
	bottle.factory('routes', (container: ClientApiContainer) => [
		{
			path: '/upload-candles-finam',
			route: new UploadCandlesFinamRoute(container.candleFinamRepository, container.candleRepository)
		}
	]);
	return bottle.container;
};
