import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class sub_food extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        sub_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        food_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "food",
            key: "food_id",
          },
        },
        sub_name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        sub_price: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
          ),
        },
        is_deleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 0,
        },
        deleted_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: "sub_food",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "sub_id" }],
          },
          {
            name: "food_id",
            using: "BTREE",
            fields: [{ name: "food_id" }],
          },
        ],
      }
    );
  }
}
