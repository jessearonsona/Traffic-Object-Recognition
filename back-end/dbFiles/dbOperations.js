const dbConfig = require("./dbConfig");
const sql = require("mssql");
const bcrypt = require("bcryptjs");

// Function to get entire user list from the database
const getUsers = async () => {
  try {
    let pool = await sql.connect(dbConfig);
    let users = await pool
      .request()
      .query("SELECT * FROM User_Details ORDER BY User_Name");

    return users;
  } catch (error) {
    console.log(error);
  }
};

// Function to add a new user to the database
const addUser = async (user) => {
  // // Hash passwords
  // const salt = await bcrypt.genSalt(10);
  // const hashPassword = await bcrypt.hash(user.User_Password, salt);
  try {
    let pool = await sql.connect(dbConfig);
    let insertUser = await pool
      .request()
      .query(
        "INSERT INTO User_Details (Id, User_Name, User_Email, User_Password, User_IsAdmin, Created_Date, Updated_Date) VALUES (" +
          user.Id +
          ",'" +
          user.User_Name +
          "','" +
          user.User_Email +
          "','" +
          user.User_Password +
          "'," +
          user.User_IsAdmin +
          ", getdate(), getdate())"
      );

    return insertUser;
  } catch (error) {
    console.log(error);
  }
};

// Function to log user in
const loginUser = async (email, password) => {
  try {
    let pool = await sql.connect(dbConfig);
    let foundUser = await pool
      .request()
      .query(
        "SELECT * FROM User_Details WHERE User_Email ='" +
          email +
          "' and User_Password = '" +
          password +
          "'"
      );

    return foundUser;
  } catch (error) {
    console.log(error);
  }
};

// Function to change a user to admin status
const changeAdminStatus = async (user) => {
  try {
    let pool = await sql.connect(dbConfig);
    let updatedUser = await pool
      .request()
      .query(
        "UPDATE User_Details SET User_IsAdmin= " +
          user.User_IsAdmin +
          " WHERE Id = " +
          user.Id
      );
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

// Function to change a user to admin status
const changePassword = async (user) => {
  //Hash password
  // const salt = await bcrypt.genSalt(10);
  // const hashPassword = await bcrypt.hash(user.User_Password, salt);
  try {
    let pool = await sql.connect(dbConfig);
    let updatedUser = await pool
      .request()
      .query(
        "UPDATE User_Details SET User_Password= '" +
          user.User_Password +
          "' WHERE Id = " +
          user.Id
      );
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

// Function to get user password from the database to display on Admin Page
const getPassword = async (user) => {
  try {
    let pool = await sql.connect(dbConfig);
    let currentPassword = await pool
      .request()
      .query("SELECT User_Password FROM User_Details WHERE Id = " + user.Id);
    return currentPassword;
  } catch (error) {
    console.log(error);
  }
};

// Function to delete a user
const deleteUser = async (user) => {
  try {
    let pool = await sql.connect(dbConfig);
    let deletedUser = await pool
      .request()
      .query("DELETE FROM User_Details WHERE Id = " + user.Id);
    return deletedUser;
  } catch (error) {
    console.log(error);
  }
};

// Function to get entire user list from the database
const getRoads = async () => {
  try {
    let pool = await sql.connect(dbConfig);
    let roads = await pool.request().query("SELECT * FROM Stations");
    return roads;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addUser,
  changeAdminStatus,
  changePassword,
  deleteUser,
  getPassword,
  getUsers,
  loginUser,
  getRoads,
};
