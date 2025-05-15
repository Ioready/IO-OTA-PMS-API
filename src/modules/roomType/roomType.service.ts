import { ConflictResponse  } from '../../lib/decorators';
import { Request, Response } from "express"

import { Msg } from '../../resources';
import { roomTypeModel } from '../../schemas/roomType.schema';



class RoomTypeService {

 // @ts-ignore
    createRoomType = async (req: Request, res: Response) => {

        const floor = await roomTypeModel.create(req.body);
        if (!floor) throw new ConflictResponse(Msg.roomTypeCreated404)
        return {floor}
    }

}
export default new RoomTypeService();