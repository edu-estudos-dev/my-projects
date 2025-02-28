import express from 'express';
import CategoriesController from '../controllers/categoriesController.js';

const categoriesRouter = express.Router();
// rota para renderizar o formulário para criação de categorias
categoriesRouter.get('/new', CategoriesController.showFormCategories);

// rota para criação de categorias
categoriesRouter.post('/save', CategoriesController.createCategory);

// rota para excluir uma categoria
categoriesRouter.delete('/:id', CategoriesController.deleteCategory);

// rota para renderizar o formulário para edição de Categoria
categoriesRouter.get('/formEditCategory/:id', CategoriesController.showFormEdit);

// rota para renderizar a tabela de categorias
categoriesRouter.get('/table', CategoriesController.showTableCategories);

// rota para editar uma categoria
categoriesRouter.put('/update/:id', CategoriesController.updateCategory);


export default categoriesRouter;