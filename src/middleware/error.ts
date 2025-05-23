import { ErrorRequestHandler, NextFunction, Request } from 'express'
import ErrorResponse from '../utils/errorResponse'
import { Model } from '../lib/model'
import { Responder } from '../lib/responder'

const errorHandler: ErrorRequestHandler = (err, _: Request, res, _1: NextFunction) => {

	let error = {
		...err,
	}
	error.message = err.message

	// Mongoose bad ObjectId
	if (err.name === 'CastError') {
		// const message = `Resource not found with id of ${err.value}`;
		const message = `Resource not found`
		error = new ErrorResponse(message, 404)
	}
	// console.log(err.name);

	// // Mongoose duplicate key
	// if (err.code === 11000) {
	// 	const message = 'Duplicate field value entered'
	// 	error = new ErrorResponse(message, 400)
	// }

	if (err.code === 11000) {
		const message = `${Model.returnText(Object.keys(err.keyValue)[0])} already exists`
		error = new ErrorResponse(message, 409)
	}

	// Mongoose validation error
	// if (err.name === 'ValidationError') {
	// 	const message: object[] = []

	// 	Object.values(err.errors).forEach((errr: any) => {
	// 		message.push({
	// 			field: errr.properties.path,
	// 			message: errr.message,
	// 		})
	// 	})
	// 	error = new ErrorResponse(null, 400, message)
	// }

	if (err.name === "ValidationError") {
		let errFields: any = Object.values(err.errors)
		let errObj: any = errFields[errFields.length - 1]
		error = new ErrorResponse(errObj['message'], 400)
	}
	console.log(err);

	if (err.status === 401) error = new ErrorResponse('user:failure.invalidCred', 401)
	Responder.sendFailureMessage(error.messageWithField || error.message || 'Server Error', error.statusCode, res)
}

export default errorHandler
