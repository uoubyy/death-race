export default class Logger {
	static i(logString: string, tag?: string) {
		console.log(`INFO: ${tag || ""} || ${logString}`);
	}

	static e(logString: string, tag?: string) {
		console.error(`ERR: ${tag || ""} || ${logString}`);
	}

	static detail(obj: object, tag?: string) {
		console.log(("===================================="));
		console.log(`Detail: ${tag || ""}`);
		console.dir(obj);
		console.log(("===================================="));
	}
}
