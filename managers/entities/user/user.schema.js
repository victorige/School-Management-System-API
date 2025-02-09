module.exports = {
  getAll: [
    {
      model: "page",
      required: false,
    },
    {
      model: "limit",
      required: false,
    },
    {
      model: "sortBy",
      required: false,
    },
    {
      model: "sortOrder",
      required: false,
    },
    {
      model: "filters",
      required: false,
    },
  ],
  create: [
    {
      model: "firstName",
      required: true,
    },
    {
      model: "lastName",
      required: true,
    },
    {
      model: "email",
      required: true,
    },
    {
      model: "password",
      required: true,
    },
    {
      model: "role",
      required: true,
    },
    {
      model: "schoolId",
      required: false,
    },
  ],
};
