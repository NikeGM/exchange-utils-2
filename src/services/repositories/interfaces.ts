export interface FinamUrlParametersList {
	code: string;
	e: string;
	market: number;
	em: number;
	p: number;
	dtf: number;
	tmf: number;
	MSOR: number;
	mstimever: number;
	sep: number;
	sep2: number;
	datf: number;
	at: number;
	df: number;
	mf: number;
	yf: number;
	dt: number;
	mt: number;
	yt: number;
	day_start: string;
	month_start: string;
	year_start: string;
	day_end: string;
	month_end: string
	year_end: string
}

export interface DbCandleType {
	code: string;
	time: string;
	date: string;
	period: string;

	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
	median: number;
	typical: number;
	weighted_close: number;
}
