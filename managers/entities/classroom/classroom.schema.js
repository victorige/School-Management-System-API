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
      model: "name",
      required: true,
    },
    {
      model: "capacity",
      required: true,
    },
    {
      model: "resources",
      required: true,
    },
  ],
  get: [],
  update: [
    {
      model: "name",
      required: false,
    },
    {
      model: "capacity",
      required: false,
    },
    {
      model: "resources",
      required: false,
    },
  ],
  delete: [],
};
