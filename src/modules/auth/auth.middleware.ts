import { NextFunction, Request, Response } from 'express'
import asyncHandler from '../../middleware/async'
import { UserModel } from '../../schemas'
import { UnauthorizedResponse } from 'http-errors-response-ts/lib'
import { Msg } from '../../resources'
import { Utils } from '../../lib/utils'

export const protect = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let token: any

		if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
			token = req.headers.authorization.split(' ')[1]
		}
		// Set token from cookie
		// else if (req.cookies.token) {
		//   token = req.cookies.token
		// }

		if (!token) {
			throw new UnauthorizedResponse(Msg.invalidToken)
		}


		try {

			// Verify token
			const decoded = Utils.verifyToken(token)

			const user: any = await UserModel.findById(decoded.id);

			if (!user) {
				throw new UnauthorizedResponse(Msg.user404);
			}

			req.user = user; // Attach user to request
			await Utils.updateKeepsignToken(req.user, req.cookies.deviceId, req, res)
			next();
		} catch (err) {
			console.log({ err });

			throw new UnauthorizedResponse(Msg.invalidCred)
		}
	}
)

// Grant access to specific roles
// export const authorize = (...roles: string[]) => {
// 	return (req: Request, _: Response, next: NextFunction) => {

// 		next()
// 	}
// }
