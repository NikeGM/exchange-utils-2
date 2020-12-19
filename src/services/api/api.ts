import express, { Express } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { RouteOptions } from './interfaces';

export class Api {
	private app;
	private readonly api: express.Router;
	private readonly options;

	constructor(private readonly routes: RouteOptions[]) {
		this.api = express.Router();
		this.routes.forEach(({route, path}) => {
			this.api.use(path, route.router)
		})

		this.options = {
			swaggerDefinition: {
				info: {
					title: 'Api',
					version: '0.0.1',
				},
			},
			apis: ['src/services/api/routes/*/*.yml'],
		};
	}

	get expressApp(): Express {
		if (!this.app) {
			this.app = express();

			// logger
			this.app.use(morgan('dev'));
			const specs = swaggerJsdoc(this.options);
			this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

			// this.app.use(bodyParser.urlencoded({ extended: false }));
			this.app.use(bodyParser.json());

			this.app.use(fileUpload({
				limits: { fileSize: 50 * 1024 * 1024 },
			}));

			// api router
			this.app.use('/api', this.api);
		}
		return this.app;
	}
}
