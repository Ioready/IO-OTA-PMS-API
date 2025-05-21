import { ConflictResponse } from '../../lib/decorators';
import { Request, Response } from "express"

import { Utils } from '../../lib/utils';

import { TaskModel } from '../../schemas/task.schema';




class TaskService {

    // @ts-ignore
    createTask = async (req: Request, res: Response) => {
        const data = req.body
        await Utils.addPropertyId(data, req)
        const task = await TaskModel.create(data);
        if (!task) throw new ConflictResponse('task:failure.create')
        return { task }
    }

    

}
export default new TaskService();