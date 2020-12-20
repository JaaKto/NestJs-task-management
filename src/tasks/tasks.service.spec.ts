import { Test } from '@nestjs/testing';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { username: 'testUser' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
});

describe('TaskSerive', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();
    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', () => {
      const filters: GetTaskFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some search query',
      };
      tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
    });
  });
});
