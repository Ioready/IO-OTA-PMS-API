import { Request, Response, RequestHandler, NextFunction } from 'express'
import 'reflect-metadata'
import { AppRouter } from '../../AppRouter';
import { MetadataKeys } from './MetadataKeys'
import { Methods } from './Methods'

import asyncHandler from '../../middleware/async'
import { config } from '../../config/env.config';

export function bodyValidators(keys: string): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.body) {
            res.status(422).send('Invalid request')
            return
        }

        for (let key of keys) {
            if (!req.body[key]) {
                res.status(422).send(`Missing property ${key}`)
                return
            }
        }

        next()
    }
}

export function Controller(routePrefix: string): Function {
    return function (target: Function, _: string) {
        const router = AppRouter.getInstance()

        for (let key of Object.getOwnPropertyNames(target.prototype)) {
            const routeHandler = Object.getOwnPropertyDescriptor(
                target.prototype,
                key
            )?.value

            const path = Reflect.getMetadata(MetadataKeys.path, target.prototype, key)

            const method: Methods = Reflect.getMetadata(
                MetadataKeys.method,
                target.prototype,
                key
            )

            const middlewares =
                Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) ||
                []

            // const requiredBodyProps =
            //     Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) || []

            // const validator: any = bodyValidators(requiredBodyProps) ?? {}
            // console.log(`${process.env.API_VERSION_PATH}${routePrefix}${path}`);
            // console.log(method);
            
            if (path) {
                router[method](
                    `${config.app.apiPrefix}${routePrefix}${path}`, // API_VERSION_PATH=/api/v1 routePrefix=auth path=/login
                    ...middlewares,
                    // validator,
                    asyncHandler(routeHandler)
                )
            }
        }
    }
}
