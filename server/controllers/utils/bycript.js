const bcrypt = require("bcrypt");

module.exports = {
  hashPassword: (userPassword, callback) => {
    bcrypt.hash(userPassword, 10, (err, hash) => {
      callback(err, hash);
    });
  },
  decodePassword: (userPassword, hashedPassword, callback) => {
    bcrypt.compare(userPassword, hashedPassword, (err, result) => {
      callback(err, result);
    });
  },
};
