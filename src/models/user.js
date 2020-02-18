const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  image: {
    type: String,
    required: true,
  },
  places: {
    // TODO: Get back to this later
    type: String,
    required: true,
  },
});
userSchema.plugin(uniqueValidator);

module.exports = model("User", userSchema);
