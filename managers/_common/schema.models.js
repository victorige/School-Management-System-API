const role = require("../../public/role.data.json");

module.exports = {
  id: {
    path: "id",
    custom: "objectId",
    customError: "id is of invalid type",
  },
  schoolId: {
    path: "schoolId",
    custom: "objectId",
    customError: "schoolId is of invalid type",
  },
  classroomId: {
    path: "classroomId",
    custom: "objectId",
    customError: "classroomId is of invalid type",
  },
  studentId: {
    path: "studentId",
    type: "string",
    custom: "objectId",
    customError: "studentId is of invalid type",
  },
  name: {
    path: "name",
    type: "string",
    length: { min: 3, max: 50 },
  },
  firstName: {
    path: "firstName",
    type: "string",
    length: { min: 3, max: 20 },
  },
  lastName: {
    path: "lastName",
    type: "string",
    length: { min: 3, max: 20 },
  },
  password: {
    path: "password",
    type: "string",
    length: { min: 8, max: 100 },
  },
  email: {
    path: "email",
    type: "string",
    regex:
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  contactEmail: {
    path: "contactEmail",
    type: "string",
    regex:
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  phone: {
    path: "phone",
    type: "string",
    length: { min: 10, max: 15 },
  },
  capacity: {
    path: "capacity",
    type: "number",
  },
  resources: {
    path: "resources",
    type: "Array",
    items: {
      type: "string",
      length: { min: 1 },
    },
  },
  enrollmentDate: {
    path: "enrollmentDate",
    custom: "date",
    customError: "enrollmentDate is an invalid date",
  },
  page: {
    path: "page",
    type: "string",
  },
  limit: {
    path: "limit",
    type: "string",
  },
  role: {
    path: "role",
    type: "string",
    enum: role.value,
  },
  sortBy: {
    path: "sortBy",
    type: "string",
  },
  sortOrder: {
    path: "sortOrder",
    type: "string",
  },
  filters: {
    path: "filters",
    type: "object",
  },
  address: {
    path: "address",
    type: "string",
    length: { min: 10, max: 250 },
  },
};
