const {
  slugify,
  flattenObject,
  arrayToObj,
  match,
  getValidationErrors,
  logger,
  throwError,
  returnError,
  returnSuccess,
  dispatchError,
  buildFilterConditions,
  buildAggregationPipeline,
  buildPagination,
  CustomError,
} = require("../libs/utils");

describe("Utility Functions", () => {
  // Test for slugify function
  test("slugify should return correct slug", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("Test & Slugify")).toBe("test-y-slugify");
  });

  // Test for flattenObject function
  test("flattenObject should flatten nested object", () => {
    const input = {
      user: {
        name: "John",
        address: {
          street: "Main St",
          city: "New York",
        },
      },
    };
    const expected = {
      "user.name": "John",
      "user.address.street": "Main St",
      "user.address.city": "New York",
    };
    expect(flattenObject(input)).toEqual(expected);
  });

  // Test for arrayToObj function
  test("arrayToObj should convert array to object", () => {
    const input = ["key1", "value1", "key2", "value2"];
    const expected = { key1: "value1", key2: "value2" };
    expect(arrayToObj(input)).toEqual(expected);
  });

  // Test for match function
  test("match should correctly match wildcard patterns", () => {
    expect(match("example.txt", "*.txt")).toBe(true);
    expect(match("test.js", "*.html")).toBe(false);
  });

  // Test for getValidationErrors function
  test("getValidationErrors should return error messages", () => {
    const validationResult = [
      { message: "Error 1" },
      { message: "Error 2" },
      { message: undefined },
    ];
    expect(getValidationErrors(validationResult)).toEqual([
      "Error 1",
      "Error 2",
    ]);
  });

  test("logger should log messages", () => {
    // Mock console.log and console.error
    console.log = jest.fn();
    console.error = jest.fn();

    logger("INFO", "This is an info message");
    logger("ERROR", "This is an info message");

    expect(console.log).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  // Test for throwError function
  test("throwError should throw CustomError with correct code", () => {
    expect(() => {
      throwError("Test Error", 400);
    }).toThrowError(CustomError);
  });

  // Test for returnSuccess function
  test("returnSuccess should return success response", () => {
    const response = returnSuccess("Success message", { id: 1 });
    expect(response).toEqual({
      message: "Success message",
      data: { id: 1 },
      code: 200,
    });
  });

  // Test for returnError function
  test("returnError should return correct error response", () => {
    const error = new CustomError("Test Error", 400);
    const response = returnError("Error message", error);
    expect(response).toHaveProperty("message", "Error message");
    expect(response).toHaveProperty("errors");
    expect(response.errors).toBeInstanceOf(Array);
  });

  // Test for dispatchError function
  test("dispatchError should call responseDispatcher with correct params", () => {
    const res = { send: jest.fn() };
    const managers = { responseDispatcher: { dispatch: jest.fn() } };
    dispatchError(res, managers, "Error message", "Some error");
    expect(managers.responseDispatcher.dispatch).toHaveBeenCalled();
  });

  // Test for buildFilterConditions function
  test("buildFilterConditions should return correct filter conditions", () => {
    const filters = { name: "John", age: 30 };
    const conditions = buildFilterConditions(filters);
    expect(conditions).toEqual({
      name: expect.any(RegExp),
      age: 30,
    });
  });

  // Test for buildAggregationPipeline function
  test("buildAggregationPipeline should return correct pipeline", () => {
    const matchConditions = { name: "John" };
    const page = 1;
    const limit = 10;
    const sortBy = "name";
    const sortOrder = 1;
    const pipeline = buildAggregationPipeline(
      matchConditions,
      page,
      limit,
      sortBy,
      sortOrder
    );
    expect(pipeline).toHaveLength(1);
    expect(pipeline[0]).toHaveProperty("$facet");
  });

  // Test for buildPagination function
  test("buildPagination should return correct pagination", () => {
    const result = [{ totalCount: [{ count: 25 }] }];
    const pagination = buildPagination({ result, page: 1, limit: 10 });
    expect(pagination).toEqual({
      totalRecords: 25,
      totalPages: 3,
      nextPage: 2,
      prevPage: null,
    });
  });
});
