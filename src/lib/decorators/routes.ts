// import { RequestHandler } from 'express'
import 'reflect-metadata'
import { MetadataKeys } from './MetadataKeys'
import { Methods } from './Methods'

// interface RouteHandlerDescriptor extends PropertyDescriptor {
//   value?: RequestHandler
// }

// function routeBinder(method: string) {
//   return function (path: string) {
//     return function (target: any, key: string, _: RouteHandlerDescriptor) {
//       Reflect.defineMetadata(MetadataKeys.path, path, target, key)
//       Reflect.defineMetadata(MetadataKeys.method, method, target, key)
//     }
//   }
// }

function routeBinder(method: string) {
  return function (path: string) {
    return function (target: any, key: string) {

      Reflect.defineMetadata(MetadataKeys.path, path, target, key);
      Reflect.defineMetadata(MetadataKeys.method, method, target, key);
    };
  };
}



export const Get = routeBinder(Methods.get)
export const Put = routeBinder(Methods.put)
export const post = routeBinder(Methods.post)
export const Delete = routeBinder(Methods.del)
export const Patch = routeBinder(Methods.patch)
