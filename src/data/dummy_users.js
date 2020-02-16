const uuidv4 = require("uuid/v4");

const DUMMY_USERS = [
  {
    id: uuidv4(),
    name: "Harry Manchanda",
    email: "harry@test.com",
    password: "testers",
  },
];

module.exports = DUMMY_USERS;
