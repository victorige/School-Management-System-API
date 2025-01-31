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
      model: "address",
      required: true,
    },
    {
      model: "contactEmail",
      required: true,
    },
    {
      model: "phone",
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
      model: "address",
      required: false,
    },
    {
      model: "contactEmail",
      required: false,
    },
    {
      model: "phone",
      required: false,
    },
  ],
  delete: [],
};
