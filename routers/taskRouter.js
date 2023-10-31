import express from 'express';
import Task from '../controllers/taskController.js';
import Authorization from '../guards/authorizationGuard.js';
import validation from '../services/validationService.js'; 

const taskRouter = express.Router()

taskRouter.get('', validation.taskValidation, Task.findAll);
taskRouter.post('', validation.taskValidation,  Task.create);
taskRouter.get('/:id', validation.taskValidation, Authorization.authorizationTask, Task.findOne);
taskRouter.put('/:id', validation.taskValidation, Authorization.authorizationTask, Task.update);
taskRouter.delete('/:id', validation.taskValidation, Authorization.authorizationTask, Task.delete);

export default taskRouter;