import Knex from 'knex';
import config from 'config';
import { CandleRepository } from './repositories/candleRepository';
import { Api } from './api';
import { CandleFinamRepository } from './repositories/candleFinamRepository';
import { UploadCandlesFinamRoute } from './routes/uploadCandlesFinam/uploadCandlesFinam';
import { ClientApiContainer } from './interfaces';
import Bottle from 'bottlejs';

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
