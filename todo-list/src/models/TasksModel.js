// models/TasksModel.js
import { DataTypes, Model } from 'sequelize';

class TasksModel extends Model {
  static initModel(connection) {
    TasksModel.init(
      {
        task: {
          type: DataTypes.STRING,
          allowNull: false,          // Impede valores null
          validate: {
            notEmpty: true          // Valida que a string não é vazia
          }
        },
        completed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false       // Define o valor padrão como false
        }
      },
      {
        sequelize: connection,
        modelName: 'Tasks',
        tableName: 'tasks'
      }
    );
    return TasksModel;
  }
}

export default TasksModel;