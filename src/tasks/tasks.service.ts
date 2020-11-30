import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRespository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.taskRespository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRespository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID:${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRespository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: number): Promise<void> {
    const result = await this.taskRespository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID:${id} not found`);
    }
  }
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
