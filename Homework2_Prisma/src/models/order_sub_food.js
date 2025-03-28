import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class order_sub_food extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    order_sub_food_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order',
        key: 'order_id'
      }
    },
    sub_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sub_food',
        key: 'sub_id'
      }
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'order_sub_food',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_sub_food_id" },
        ]
      },
      {
        name: "order_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_id" },
          { name: "sub_id" },
        ]
      },
      {
        name: "sub_id",
        using: "BTREE",
        fields: [
          { name: "sub_id" },
        ]
      },
    ]
  });
  }
}
