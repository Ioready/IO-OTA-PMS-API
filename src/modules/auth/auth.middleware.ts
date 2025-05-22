import { NextFunction, Request, Response } from 'express'
import asyncHandler from '../../middleware/async'
import { DeviceModel, UserModel } from '../../schemas'
import { ForbiddenResponse, UnauthorizedResponse } from 'http-errors-response-ts/lib'
import { CheckPropertyUrl, Msg } from '../../resources'
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
			const decoded: any = Utils.verifyToken(token)
			const { id, deviceId } = (decoded as { id: string, deviceId: string });
			const user: any = await UserModel.findById(id);
       console.log(user);
	   
			if (!user) {
				throw new UnauthorizedResponse(Msg.invalidCred);
			}

			const device: any = await DeviceModel.findOne({ deviceId: deviceId });

			if (!device) {
				throw new UnauthorizedResponse(Msg.invalidCred);
			}

			req.user = user; // Attach user to request
			req.deviceId = deviceId;
			await Utils.updateKeepsignToken(req.user, decoded.deviceId, res)
			next();
		} catch (err) {

			if (err instanceof ForbiddenResponse || err instanceof UnauthorizedResponse) {
				throw err;
			}
			if (err.name === 'TokenExpiredError') {
				throw new ForbiddenResponse('user:failure.tokenExpired')
			} else {
				throw new UnauthorizedResponse('user:failure.invalidToken')
			}
		}
	}
)

// Grant access to specific roles
// export const authorize = (...roles: string[]) => {
// 	return (req: Request, _: Response, next: NextFunction) => {

// 		next()
// 	}
// }


export const checkProperty = asyncHandler(
	async (req: Request, _res: Response, next: NextFunction) => {
		const user = req.user;
		const checkProperty = await Utils.checkProperty(user);
		if (checkProperty.redirectUrl === CheckPropertyUrl.PROPERTY) throw new ForbiddenResponse('property:failure.add')
		next();
	}
)
