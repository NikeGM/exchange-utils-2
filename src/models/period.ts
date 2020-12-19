export class Period {
	public readonly symbol = null;

	constructor(periodInput: string|Period) {
		switch (true) {
			case periodInput instanceof Period:
				this.symbol = (periodInput as Period).symbol
				break;
			default:
				this.symbol = (periodInput as string).toUpperCase();
		}
	}
}