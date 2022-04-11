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
    console.log(users);
    return users;
  } catch (error) {
    console.log(error);
  }
};

// Function to add a new user to the database
const addUser = async (user) => {
  //Hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(user.User_Password, salt);
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
          hashPassword +
          "'," +
          user.User_IsAdmin +
          ", getdate(), getdate())"
      );
    // console.log(insertUser);
    return insertUser;
  } catch (error) {
    console.log(error);
  }
};

// Function to log user in
const loginUser = async (user) => {
  try {
    let pool = await sql.connect(dbConfig);
    let authUser = await pool
      .request()
      .query(
        "SELECT * FROM User_Details WHERE User_Email = " + user.User_Email
      );

    // decrypt password and attempt to match (!!!!!!!!!!!!!!!!!!!!!!!!THIS CODE IS A BIT OF A GUESS!!!!!!!!!!!!!!!!!!!!!!!!)
    const validPassword = await bcrypt.compare(
      user.User_Password,
      authUser[0].User_Password
    );
    console.log(authUser);
    if (validPassword) {
      return authUser;
    }
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
    console.log(updatedUser);
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addUser, getUsers, loginUser, changeAdminStatus };
