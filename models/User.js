const bcrypt = require("bcrypt");
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create User Model
class User extends Model {}

// define table columns and configuration
User.init(
  {
    // table columns
    id: {
      // use Sequelize DataTypes object to provide what type of data it is
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // define username column
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // define email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // use to prevent duplicate email data
      unique: true,
      // if allowNull is set to false, validators can run through before creating a table data
      validate: {
        isEmail: true,
      },
    },
    // define password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // password has to be at least four characters long
        len: [4],
      },
    },
  },
  {
    hooks: {
      // set up beforeCreate hook functionality
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },
    // pass in imported sequelize connection
    sequelize,
    // don't automatically create a timestamp
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscore instead of camel-casing
    underscored: true,
    // make model name stay lowercase
    modelName: "user",
  }
);

module.exports = User;
