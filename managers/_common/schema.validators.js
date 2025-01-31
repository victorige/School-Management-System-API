module.exports = {
  objectId: (data) => require("mongoose").Types.ObjectId.isValid(data),
  date: (data) => require("validate-date")(data),
};
