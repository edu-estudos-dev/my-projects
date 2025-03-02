import express from 'express';
import TasksController from '../controllers/TasksController.js';

const router = express.Router();

// rota para renderizar home
router.get('/', TasksController.showHome);

// rota para renderizar formulario
router.get('/newTask', TasksController.showForm);

// rota para criar nova tarefa
router.post('/save', TasksController.CreateTask);

// rota para renderizar tabela com as tarefas
router.get('/table', TasksController.showTasks);

// rota para renderizar formulário de edição de tarefas
router.get('/edit/:id', TasksController.showEditFormTask);

// rota para atualizar tarefa
router.put('/update/:id', TasksController.updateTask);

// rota para excluir uma tarefa
router.delete('/delete/:id', TasksController.deleteTask);

// rota para alternar o status de conclusão da tarefa
router.patch('/toggle/:id', TasksController.toggleTaskCompletion);

export default router;
