import { CandleRepository } from './repositories/candleRepository';
import { CandleFinamRepository } from './repositories/candleFinamRepository';
import { IContainer } from 'bottlejs';
import { Api } from './api';
import Knex from 'knex';
import { Router } from 'express';

export interface ClientApiContainer extends IContainer{
	api: Api;
	dbClient: Knex;
	candleRepository: CandleRepository;
	candleFinamRepository: CandleFinamRepository;
	routes: RouteOptions[];
}

export interface IRoute {
	router: Router;
	controller: Function;
}

export interface RouteOptions {
	path: string;
	route: IRoute;
}

export enum DB_TABLES {
	CANDLES = 'candles'
}