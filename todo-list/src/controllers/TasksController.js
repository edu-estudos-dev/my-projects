import TasksModel from '../models/TasksModel.js';

class TasksController {
	// Método para criar uma tarefa
	async CreateTask(req, res) {
		const { task } = req.body;

		if (!task || task.trim() === '') {
			req.flash('error', 'Por favor, insira uma descrição para a tarefa!');
			return res.redirect('/newTask');
		}

		try {
			await TasksModel.create({
				task,
				completed: false // Explicitamente definir como falso
			});
			req.flash('success', 'Tarefa criada com sucesso!');
			res.redirect('/table');
		} catch (error) {
			console.error('Erro ao criar tarefa:', error);
			req.flash('error', 'Ocorreu um erro ao salvar a tarefa');
			res.redirect('/newTask');
		}
	}
	// Método para rebderizar a home
	showHome(req, res) {
		res.render('home', {
			messages: {
				error: req.flash('error'),
				success: req.flash('success')
			}
		});
	}

	// Método para renderizar o formulário de cadastro de tarefa
	showForm(req, res) {
		res.render('formTasks', {
			messages: {
				error: req.flash('error'),
				success: req.flash('success')
			}
		});
	}

	// Método para renderizar a tabelas com as tarefas cadastradas
	async showTasks(req, res) {
		try {
			const tasks = await TasksModel.findAll({
				order: [['createdAt', 'DESC']]
			});

			res.render('tableTasks', {
				tasks,
				messages: {
					success: req.flash('success'),
					error: req.flash('error')
				}
			});
		} catch (error) {
			console.error('Erro ao buscar tarefas:', error);
			req.flash('error', 'Não foi possível carregar as tarefas');
			res.redirect('/');
		}
	}

	// Método para renderizar o formuláio de edição de tarefa
	async showEditFormTask(req, res) {
		const id = parseInt(req.params.id, 10);

		try {
			if (isNaN(id) || id <= 0) {
				req.flash('error', 'ID inválido');
				return res.redirect('/table');
			}

			const task = await TasksModel.findByPk(id);

			if (!task) {
				req.flash('error', 'Tarefa não encontrada');
				return res.redirect('/table');
			}

			res.render('editFormTask', {
				task: task,
				messages: {
					error: req.flash('error'),
					success: req.flash('success')
				}
			});
		} catch (error) {
			console.error('Erro ao editar tarefa:', error);
			req.flash('error', 'Falha ao editar a tarefa');
			res.redirect('/table');
		}
	}

	// Método para atualizar uma tarefa
	async updateTask(req, res) {
		const id = parseInt(req.params.id, 10);
		const { task } = req.body;

		if (isNaN(id) || id <= 0) {
			req.flash('error', 'Id inválido');
			return res.redirect('/table');
		}

		if (!task || task.trim() === '') {
			req.flash('error', 'Descrição da tarefa não pode ser vazia!');
			return res.redirect(`/editTask/${id}`);
		}

		try {
			await TasksModel.update({ task }, { where: { id } });
			req.flash('success', 'Tarefa atualizada com sucesso!');
			return res.redirect('/table');
		} catch (error) {
			console.error('Erro ao atualizar tarefa:', error);
			req.flash('error', 'Falha ao atualizar a tarefa');
			res.redirect('/table');
		}
	}

	// Método para excluir uma tarefa
	async deleteTask(req, res) {
		const id = parseInt(req.params.id, 10);

		if (isNaN(id) || id <= 0) {
			req.flash('error', 'ID inválido');
			return res.redirect('/table');
		}
      
		try {
			const taskDeleted = await TasksModel.destroy({ where: { id } });

			if (!taskDeleted) {
				req.flash('error', 'Tarefa não encontrada');
				return res.redirect('/table');
			}

			req.flash('success', 'Tarefa excluída com sucesso!');
			res.redirect('/table');
		} catch (error) {
			console.error('Erro ao excluir tarefa:', error);
			req.flash('error', 'Falha ao excluir a tarefa');
			res.redirect('/table');
		}
	}

	// Método para alternar o status de conclusão de uma tarefa
	async toggleTaskCompletion(req, res) {
		const id = parseInt(req.params.id, 10);

		if (isNaN(id) || id <= 0) {
			req.flash('error', 'ID inválido');
			return res.redirect('/table');
		}

		try {
			// Buscar a tarefa atual para obter o status atual
			const task = await TasksModel.findByPk(id);

			if (!task) {
				req.flash('error', 'Tarefa não encontrada');
				return res.redirect('/table');
			}

			// Alternar o status de conclusão
			const completed = !task.completed;

			// Atualizar a tarefa com o novo status
			await TasksModel.update({ completed }, { where: { id } });

			// Mensagem de feedback para o usuário
			const message = completed
				? 'Tarefa marcada como concluída!'
				: 'Tarefa marcada como pendente!';

			req.flash('success', message);
			return res.redirect('/table');
		} catch (error) {
			console.error('Erro ao alternar status da tarefa:', error);
			req.flash('error', 'Falha ao atualizar o status da tarefa');
			res.redirect('/table');
		}
	}
}

export default new TasksController();
