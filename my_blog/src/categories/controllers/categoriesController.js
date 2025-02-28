import slugify from 'slugify';
import { models } from '../../models/index.js';

class CategoriesController {
	// Método para renderizar o formulário de criação de categorias
	async showFormCategories(_req, res) {
		res.render('categories/formNewCategory');
	}

	// Método para criar uma nova categoria
	async createCategory(req, res) {
		try {
			const { title } = req.body;

			if (!title) {
				return res.redirect('/categories/new');
			}

			const upperCaseTitle = title.toUpperCase();
			const slug = slugify(upperCaseTitle).toLowerCase();

			const existingCategory = await models.Category.findOne({ where: { slug } });

			if (existingCategory) {
				return res.status(400).send('Categoria já existe');
			}

			const category = await models.Category.create({ title: upperCaseTitle, slug });

			console.log('Categoria criada:', category.title);
			res.redirect('/categories/table');
		} catch (error) {
			console.error('Erro ao criar categoria:', error);
			res.status(500).send('Erro ao criar categoria');
		}
	}

	// Método para renderizar a tabela com as categorias
	async showTableCategories(_req, res) {
		try {
			const categories = await models.Category.findAll({
            order: [['id', 'desc']],
         });

			res.render('categories/tableCategories', { categories });
		} catch (error) {
			console.error(
				'Erro ao renderizar a tabela de categorias:',
				error.message
			);
			res.status(500).send('Erro ao renderizar a tabela de categorias');
		}
	}

	// Método para excluir categoria
	async deleteCategory(req, res) {
		try {
			const id = parseInt(req.params.id, 10);

			if (!Number.isInteger(id) || id <= 0) {
				return res.status(400).json({ message: 'Id inválido' });
			}

			const deletedCategory = await models.Category.destroy({ where: { id } });

			if (deletedCategory === 0) {
				return res.status(404).json({ message: 'Categoria não encontrada' });
			}

			res.redirect('/categories/table');
		} catch (error) {
			console.error('Erro ao deletar categoria:', error);
		}
	}

	// Método para renderizar o formulário de edição de categoria
	async showFormEdit(req, res) {
		try {
			const id = parseInt(req.params.id, 10);

			if (!Number.isInteger(id) || id <= 0) {
				return res.status(400).render('error', {
					message: 'ID de categoria inválido'
				});
			}

			const editCategory = await models.Category.findByPk(id);

			if (!editCategory) {
				return res.status(404).render('error', {
					message: 'Categoria não encontrada'
				});
			}

			res.render('categories/formEditCategory', { category: editCategory });
		} catch (error) {
			console.error('Erro ao carregar formulário de edição:', error);
			res.status(500).render('500', {
				message: 'Erro interno ao carregar a página de edição'
			});
		}
	}

	// Método para atualizar uma categoria
	async updateCategory(req, res) {
		try {
			const { title } = req.body;
			const id = req.params.id;

			const upperCaseTitle = title.toUpperCase();
			const slug = slugify(title).toLowerCase();

			await models.Category.update(
				{ title: upperCaseTitle, slug },
				{ where: { id } }
			);

			res.redirect('/categories/table');
		} catch (error) {
			console.error('Erro ao atualizar categoria:', error);
			res.status(500).render('500', {
				message: 'Erro ao atualizar categoria'
			});
		}
	}
}

export default new CategoriesController();
