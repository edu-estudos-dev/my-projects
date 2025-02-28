import { Op } from 'sequelize';
import slugify from 'slugify';
import striptags from 'striptags';
import truncate from 'truncate-html';
import { models } from '../../models/index.js';

class ArticlesController {
	// Método para renderizar o formulário de criação de artigos
	async showFormArticle(_req, res) {
		try {
			const categories = await models.Category.findAll();
			res.render('articles/FormNewArticle', { categories });
		} catch (error) {
			console.error('Erro ao carregar formulário:', error);
			res.status(500).send('Erro ao carregar formulário');
		}
	}

	// Método para criar um novo artigo
	async createArticle(req, res) {
		try {
			const { title, body, category } = req.body;
			const slug = slugify(title).toLowerCase();

			// Remove tags HTML do body antes de salvar
			const plainBody = striptags(body);

			const upperCaseTitle = title.toUpperCase();

			await models.Article.create({
				title: upperCaseTitle,
				slug,
				body: plainBody, // Usa o body limpo
				categoryId: category
			});

			res.redirect('/articles/table');
		} catch (error) {
			console.error('Erro ao criar artigo:', error);
			const categories = await models.Category.findAll();
			res.render('articles/FormNewArticle', {
				categories,
				error: 'Erro ao criar artigo'
			});
		}
	}

	// Método para renderizar a tabela de artigos
	async showTableArticles(_req, res) {
		try {
			const articles = await models.Article.findAll({
				order: [['id', 'desc']],
				include: {
					model: models.Category,
					as: 'category'
				}
			});

			const processedArticles = articles.map(article => ({
				...article.dataValues,
				shortBody: truncate(article.body, {
					length: 10, // Máximo de caracteres
					byWords: true, // Cortar por palavras completas
					ellipsis: '...', // Sufixo
					stripTags: true // Remove HTML tags
				})
			}));

			res.render('articles/tableArticles', { articles: processedArticles });
		} catch (error) {
			console.error('Erro ao renderizar a tabela de artigos:', error);
			res.status(500).send('Erro ao renderizar a tabela de artigos');
		}
	}

	// Método para excluir categoria
	async deleteArticle(req, res) {
		try {
			const id = parseInt(req.params.id, 10);

			if (!Number.isInteger(id) || id <= 0) {
				return res.status(400).json({ message: 'Id inválido' });
			}

			const deletedArticle = await models.Article.destroy({ where: { id } });

			if (deletedArticle === 0) {
				return res.status(400).json({ message: 'Artigo não encontrado.' });
			}

			res.redirect('/articles/table');
		} catch (error) {
			console.error('Erro ao excluir artigo:', error);
			res.status(500).send('Erro ao excluir artigo.');
		}
	}

	// Método para renderizar o formulário de edição de Artigo
	async showFormEdit(req, res) {
		try {
			const id = parseInt(req.params.id, 10);

			if (!Number.isInteger(id) || id <= 0) {
				return res.status(400).render('error', {
					message: 'ID de artigo inválido'
				});
			}

			const editArticle = await models.Article.findByPk(id);

			if (!editArticle) {
				return res.status(404).render('error', {
					message: 'Artigo não encontrado'
				});
			}

			const categories = await models.Category.findAll();

			// Remove todas as tags HTML do body
			const plainBody = striptags(editArticle.body);

			res.render('articles/formEditArticle', {
				article: { ...editArticle.dataValues, body: plainBody },
				categories: categories
			});
		} catch (error) {
			console.error('Erro ao carregar formulário de edição:', error);
			res.status(500).render('500', {
				message: 'Erro interno ao carregar a página de edição'
			});
		}
	}

	// Método para atualizar um artigo
	async updateArticle(req, res) {
		try {
			const { title, body, category } = req.body;

			const id = req.params.id;

			const upperCaseTitle = title.toUpperCase();
			const slug = slugify(title).toLowerCase();

			await models.Article.update(
				{
					title: upperCaseTitle,
					slug,
					body: body,
					categoryId: category
				},
				{
					where: { id }
				}
			);

			res.redirect('/articles/table');
		} catch (error) {
			console.error('Erro ao atualizar artigo:', error);
			res.status(500).render('500', {
				message: 'Erro ao atualizar artigo'
			});
		}
	}

	// Método para buscar um artigo pelo slug
	async getArticleBySlug(req, res) {
		try {
			const article = await models.Article.findOne({
				where: { slug: req.params.slug },
				include: [
					{
						model: models.Category,
						as: 'category'
					}
				]
			});

			if (!article) {
				return res.status(404).render('404');
			}
			res.render('articles/article', { article });
		} catch (error) {
			console.error('Erro detalhado:', error);
			res.status(500).render('500');
		}
	}

	// Método para mostrar todos os artigos de uma categoria
	async getArticlesByCategory(req, res) {
		try {
			const categoryId = parseInt(req.params.id, 10);
			const category = await models.Category.findByPk(categoryId, {
				include: [
					{
						model: models.Article,
						as: 'articles',
						attributes: ['id', 'title', 'slug', 'createdAt']
					}
				]
			});

			if (!category) {
				return res.status(404).render('404');
			}

			res.render('articles/articlesByCategory', {
				category: category.toJSON()
			});
		} catch (error) {
			console.error('Erro:', error);
			res.status(500).render('500');
		}
	}

	// Método para criar paginação
	async createPagination(req, res) {
		try {
			const page = parseInt(req.params.num, 10);
			let offset = 0;

			// Verifica se page é válido e calcula o offset
			if (isNaN(page) || page <= 1) {
				offset = 0;
			} else {
				offset = (page - 1) * 4;
			}

			const articles = await models.Article.findAndCountAll({
				limit: 4,
				offset: offset,
				order: [['id', 'desc']],
				include: [{ model: models.Category, as: 'category' }]
			});

			const next = offset + 4 < articles.count;

			const result = {
				next: next,
				articles: articles.rows,
				total: articles.count,
				page: page || 1
			};

			return res.render('articles/page', { result });
		} catch (error) {
			console.error('Erro na paginação:', error);
			return res.status(500).json({ error: 'Erro ao buscar artigos' });
		}
	}

	// Método de pesquisa
	async search(req, res) {
		const { q, page = 1 } = req.query; // Pega o termo "q" e a página da query string

		if (!q || q.trim() === '') {
			return res.render('articles/search-results', {
				articles: [],
				searchTerm: q,
				page: 1,
				hasNext: false,
				hasPrev: false,
				totalPages: 0,
				user: req.session.user,
				message: 'Digite um termo de busca válido.'
			});
		}

		const limit = 10;
		const offset = (page - 1) * limit;

		try {
			const articles = await models.Article.findAll({
				where: {
					[Op.or]: [
						{ title: { [Op.like]: `%${q}%` } },
						{ body: { [Op.like]: `%${q}%` } }
					]
				},
				include: [
					{
						model: models.Category,
						as: 'category',
						attributes: ['id', 'title']
					}
				],
				limit: limit,
				offset: offset,
				order: [['id', 'DESC']]
			});

			const count = await models.Article.count({
				where: {
					[Op.or]: [
						{ title: { [Op.like]: `%${q}%` } },
						{ title: { [Op.like]: `%${q}%` } }
					]
				}
			});

			const totalPages = Math.ceil(count / limit);
			const hasNext = page < totalPages;
			const hasPrev = page > 1;

			res.render('articles/search-results', {
				// Nova view para os resultados
				articles,
				searchTerm: q,
				page: parseInt(page),
				hasNext,
				hasPrev,
				totalPages,
				user: req.session.user,
            message: null
			});
		} catch (error) {
			console.error('Erro na busca:', error);
			res.status(500).render('500');
		}
	}
}

export default new ArticlesController();
