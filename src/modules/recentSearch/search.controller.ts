import { Controller, Get, Post } from "../../lib/decorators";
import { Responder } from "../../lib/responder";
import { Request, Response } from "express";
import RecentSearchService from "../recentSearch/search.service"

import { use } from "../../lib/decorators/use";
import { protect } from "../auth/auth.middleware";

@Controller("/recent-search")
// @ts-ignore
class RecentSearchController {
    @Post("/")
    @use(protect)
    async createRecentSearch(req: Request, res: Response) {
        const result = await RecentSearchService.createRecentSearch(req, res);
        if (result) Responder.sendSuccessCreatedMessage('recentSearch:success.create', res);
    }

    @Get("/")
    @use(protect)
    // @ts-ignore
    async getRecentSearch(req: Request, res: Response) {
        const result = await RecentSearchService.getRecentSearch();
        if (result) Responder.sendSuccessData(result, 'recentSearch:success.list', res);
    }

}
