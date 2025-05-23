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

    getAllTask = async (req: Request) => {
        const query: any = req.query;
        await Utils.getPropertyId(query,req)
        if (query.searchText) {
            const regExp = Utils.returnRegExp(query.searchText);
            query["$or"] = [
                { "room.roomNumber": regExp },
                { "assignTo.fullName": regExp },
            ];
            delete query.searchText;
        }

        await Utils.getPropertyId(query, req)
        const pipeline = [
            Utils.lookupSelectedField("users", "assignTo", "_id", { _id: 1, fullName: 1 }, "assignTo"),
            Utils.unwind("$assignTo"),
            Utils.lookupSelectedField("rooms", "room", "_id", { _id: 1, roomNumber: 1 }, "room"),
            Utils.unwind("$room"),
            { $match: query },
        ];
        const projection = {
            _id: 1,
            date: 1,
            room: 1,
            assignTo: 1,
            priority: 1,
            status: 1,
            createdAt: 1,
        }

        let pageLimit = Utils.returnPageLimit(query);
        const tasks = await Model.aggregate(TaskModel, pipeline, projection, pageLimit)
        if (!tasks) throw new NotFoundResponse('task:failure.list')
        return { tasks: tasks.data, total: tasks.total }
    }


}
export default new TaskService();