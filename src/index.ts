import { getClientApiContainer } from './services/api/container';
import config from 'config';

const container = getClientApiContainer();

container.api.expressApp.listen(config.api.port, () => {
	console.log(`Started on port ${config.api.port}`);
});
