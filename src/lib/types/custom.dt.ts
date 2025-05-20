declare namespace Express {
	export interface Request {
		user: {
			[key: string]: string
		},
		language?: string;
		deviceId?: string
	}
}

declare namespace Express {
	export interface Response {
		advancedResults?: {}
	}
}

