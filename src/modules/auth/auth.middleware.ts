import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import asyncHandler from '../../middleware/async'
import { UserModel } from '../../schemas'
import { UnauthorizedResponse } from 'http-errors-response-ts/lib'
import { Msg } from '../../resources'
import { config } from '../../config/env.config'

export const protect = asyncHandler(
	async (req: Request, _: Response, next: NextFunction) => {
		let token

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			token = req.headers.authorization.split(' ')[1]
		}
		// Set token from cookie
		// else if (req.cookies.token) {
		//   token = req.cookies.token
		// }

		if (!token) {
			throw new UnauthorizedResponse("Token invlaid")
		}


		try {

			// Verify token
			const decoded = jwt.verify(token, config.jwt.secret!)

			const user:any = await UserModel.findById(decoded.id);

			if (!user) {
				throw new UnauthorizedResponse(Msg.user404);
			}

			req.user = user; // Attach user to request
			next();
		} catch (err) {
			throw new UnauthorizedResponse(Msg.userUnAuth)
		}
	}
)

// Grant access to specific roles
// export const authorize = (...roles: string[]) => {
// 	return (req: Request, _: Response, next: NextFunction) => {

// 		next()
// 	}
// }
