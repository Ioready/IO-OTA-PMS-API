
import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"
import { TicketModel } from '../../schemas';
import { Msg } from '../../resources';
import { Model } from '../../lib/model';
import { bodyValidation } from '../../middleware/validation';

class TicketService {

    // @ts-ignore
    createTicket = async (req: Request, res: Response) => {

        const data = req.body;
        let validateErr: any = bodyValidation(["category", "priority"], req, res)
        if (!validateErr) return;
        const ticket = await TicketModel.create(data);
        if (!ticket) throw new ConflictResponse(Msg.ticketCreated404)
        return ticket
    }

    editTicket = async (req: Request) => {

        const ticket = await Model.findOneAndUpdate(TicketModel, { _id: req.params.id }, req.body);
        if (!ticket) throw new NotFoundResponse(Msg.ticket404)
        return ticket
    }

    getTicket = async (id: any) => {

        const ticket = await Model.findOne(TicketModel, { _id: id });
        if (!ticket) throw new NotFoundResponse(Msg.ticket404)
        return ticket
    }

    // @ts-ignore
    getTickets = async (req: Request) => {

        const tickets = await Model.find(TicketModel, req.query, {});
        if (!tickets) throw new NotFoundResponse(Msg.tickets404)
        return { tickets: tickets.data, total: tickets.total }
    }

}

export default new TicketService();