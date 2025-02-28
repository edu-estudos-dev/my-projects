import { DataTypes } from 'sequelize';

export default sequelize => {
	const Category = sequelize.define('Category', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		slug: {
			type: DataTypes.STRING,
			unique: true
		}
	});

	Category.associate = models => {
		Category.hasMany(models.Article, {
			foreignKey: 'categoryId',
			as: 'articles'
		});
	};

	return Category;
};
