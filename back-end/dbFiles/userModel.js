class User {
  constructor(
    Id,
    User_Name,
    User_Email,
    User_Password,
    User_IsAdmin,
    Created_Date,
    Updated_Date
  ) {
    this.Id = Id;
    this.User_Name = User_Name;
    this.User_Email = User_Email;
    this.User_Password = User_Password;
    this.User_IsAdmin = User_IsAdmin;
    this.Created_Date = Created_Date;
    this.Updated_Date = Updated_Date;
  }
}

module.exports = User;
