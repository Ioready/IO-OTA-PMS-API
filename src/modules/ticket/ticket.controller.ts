
import { Controller, Get, Post, Patch } from '../../lib/decorators';
import { Responder } from '../../lib/responder';
import { Msg } from '../../resources';

import { Request, Response } from "express"
import TicketService from './ticket.service';

@Controller("/ticket")
// @ts-ignore
class TicketController {

    @Post('/')
    async createTicket(req: Request, res: Response) {
        const result = await TicketService.createTicket(req, res);
        if (result) Responder.sendSuccessCreatedMessage(Msg.ticketCreated, res);
    }

    @Patch("/:id")
    async editTicket(req: Request, res: Response) {
        const result = await TicketService.editTicket(req);
        if (result) Responder.sendSuccessMessage(Msg.ticketUpdated, res)
    }

    @Get("/:id")
    async getTicket(req: Request, res: Response) {
        const ticket = await TicketService.getTicket(req.params.id);
        if (ticket) Responder.sendSuccessData({ ticket }, Msg.ticket, res)
    }

    @Get("/")
    async getTickets(req: Request, res: Response) {
        const result = await TicketService.getTickets(req);
        if (result) Responder.sendSuccessData(result, Msg.tickets, res)
    }

}