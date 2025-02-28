import express from 'express';
import ArticlesController from '../controllers/articlesController.js';

const articlesRouter = express.Router();

// rota para renderizar o formulário para criação de artigos
articlesRouter.get('/new', ArticlesController.showFormArticle);     

// rota para criação de artigos
articlesRouter.post('/save', ArticlesController.createArticle);    

// rota para renderizar o formulário para edição de Categoria
articlesRouter.get('/formEditArticle/:id', ArticlesController.showFormEdit); 

// rota para editar uma artigo
articlesRouter.put('/update/:id', ArticlesController.updateArticle);     

// rota para excluir uma artigo
articlesRouter.delete('/:id', ArticlesController.deleteArticle);        

// rota para renderizar a tabela de artigos
articlesRouter.get('/table', ArticlesController.showTableArticles); 

// rota para pesquisar artigos
articlesRouter.get('/search', ArticlesController.search)

// rota de paginação
articlesRouter.get('/page/:num', ArticlesController.createPagination); 

// rota para renderizar a página de artigos de uma categoria selecionada
articlesRouter.get('/categories/:id/articles', ArticlesController.getArticlesByCategory); 

// rota para pegar um artigo por slug
articlesRouter.get('/:slug', ArticlesController.getArticleBySlug);   

export default articlesRouter;