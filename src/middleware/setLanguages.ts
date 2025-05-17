// middleware/setLanguage.ts
import { Request, Response, NextFunction } from 'express';
import parser from 'accept-language-parser';

const supportedLangs = ['en', 'tr'];
const defaultLang = 'en';

export function setLanguage(req: Request, _res: Response, next: NextFunction) {    
    const lang = parser.pick(supportedLangs, req.headers['accept-language']) || defaultLang;
    req.language = lang;
    next();
}
