import { ConflictResponse, NotFoundResponse } from '../../lib/decorators';
import { Request, Response } from "express"

import { Utils } from '../../lib/utils';
import { TaskModel } from '../../schemas';
import { Model } from '../../lib/model';






class TaskService {

    // @ts-ignore
    createTask = async (req: Request, res: Response) => {
        const data = req.body
        await Utils.addPropertyId(data, req)
        const task = await TaskModel.create(data);
        if (!task) throw new ConflictResponse('task:failure.create')
        return { task }
    }
    editTask = async (req: Request) => {
        const taskId = req.params.id
        await this.detailTask(taskId);
        const task = await Model.findOneAndUpdate(TaskModel, { _id: taskId }, req.body);
        if (!task) throw new NotFoundResponse('task:failure.update')
                return { task };
    }

    detailTask = async (id: any) => {
            const task = await Model.findOne(TaskModel, { _id: id });
            if (!task) throw new NotFoundResponse('task:failure.detail')
            return { task };
        }
    
     deleteTask = async (id: any) => {
            await this.detailTask(id)
            const task = await Model.findOneAndDelete(TaskModel, { _id: id });
            if (!task) throw new NotFoundResponse('task:failure.delete')
            return { task };
        }


    

}
export default new TaskService();