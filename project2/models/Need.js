const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Need extends Model {}

Need.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
         
          user_id: {
            type: DataTypes.INTEGER,
            references: {
              model: 'user',
              key: 'id',
            },
          },
          
    },
     
          
     {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'need',
      }
 );

 module.exports = Need;