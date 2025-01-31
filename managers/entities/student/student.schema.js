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
      model: "classroomId",
      required: true,
    },
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
      model: "enrollmentDate",
      required: false,
    },
  ],
  get: [],
  update: [
    {
      model: "firstName",
      required: false,
    },
    {
      model: "lastName",
      required: false,
    },
    {
      model: "email",
      required: false,
    },
    {
      model: "enrollmentDate",
      required: false,
    },
  ],
  delete: [],
  transfer: [
    {
      model: "classroomId",
      required: true,
    },
    {
      model: "studentId",
      required: true,
    },
  ],
};
