// models/index.js (corrigido)
import { Sequelize } from 'sequelize';
import articleModel from '../articles/models/articleModel.js';
import categoryModel from '../categories/models/categoryModel.js';
import userModel from '../users/models/usersModel.js';

const sequelize = new Sequelize('my_blog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false,
    timezone: '-03:00'
});

// Inicializar modelos
const models = {
    Category: categoryModel(sequelize),
    Article: articleModel(sequelize),
    Users: userModel(sequelize) 
};

// Configurar associações
models.Category.associate(models);
models.Article.associate(models);

export { models, sequelize };