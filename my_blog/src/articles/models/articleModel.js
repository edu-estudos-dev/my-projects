import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Article = sequelize.define('article', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  });

  Article.associate = (models) => {
    Article.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  };

  return Article;
};
