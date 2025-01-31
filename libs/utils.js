const slugify = (text) => {
  const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  const to = "aaaaaeeeeeiiiiooooouuuunc------";

  const newText = text
    .split("")
    .map((letter, i) =>
      letter.replace(new RegExp(from.charAt(i), "g"), to.charAt(i))
    );

  return newText
    .toString() // Cast to string
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-y-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

const flattenObject = (ob, marker) => {
  if (!marker) marker = ".";
  var toReturn = {};
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    if (typeof ob[i] == "object" && ob[i] !== null) {
      if (Array.isArray(ob[i])) {
        toReturn[i] = ob[i];
      } else {
        var flatObject = flattenObject(ob[i], marker);
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;
          toReturn[i + marker + x] = flatObject[x];
        }
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

const arrayToObj = (arr) => {
  let keys = arr.filter((_, index) => index % 2 === 0);
  let values = arr.filter((_, index) => index % 2 !== 0);
  let obj = {};
  keys.reduce((sighting, key, index) => {
    obj[key] = values[index];
    return obj;
  }, {});
  return obj;
};

_regExpEscape = (s) => {
  return s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
};
_wildcardToRegExp = (s) => {
  return new RegExp("^" + s.split(/\*+/).map(_regExpEscape).join(".*") + "$");
};

const match = (str, model) => {
  return _wildcardToRegExp(model).test(str);
};

const getValidationErrors = (validationResult) => {
  if (!validationResult || validationResult.length === 0) {
    return "";
  }

  // Collect all error messages from the validation result
  const errorMessages = validationResult
    .map((error) => error.message)
    .filter((message) => message !== undefined);

  return errorMessages;
};

const logger = (type = "INFO", message) => {
  const timestamp = new Date().toISOString();
  const formattedMessage = `${timestamp} :: ${type.toUpperCase()} :: ${message}`;

  const logTypes = {
    ERROR: "\x1b[31m", // Red
    OK: "\x1b[32m", // Green
    INFO: "\x1b[37m", // White
  };

  const resetColor = "\x1b[0m";
  const logColor = logTypes[type.toUpperCase()] || logTypes.INFO;

  const emojis = {
    ERROR: "❌",
    OK: "✅",
    INFO: "ℹ️",
  };

  const emoji = emojis[type.toUpperCase()] || emojis.INFO;

  switch (type.toUpperCase()) {
    case "ERROR":
      console.error(logColor, `${emoji} ${formattedMessage}`, resetColor);
      break;

    case "OK":
      console.log(logColor, `${emoji} ${formattedMessage}`, resetColor);
      break;
    default:
      console.log(logColor, `${emoji} ${formattedMessage}`, resetColor);
      break;
  }
};

class CustomError extends Error {
  constructor(message, code) {
    super(message); // Set the message of the error
    this.code = code; // Add the custom 'code' property
  }
}

const throwError = (message, code) => {
  throw new CustomError(message, code);
};

const returnSuccess = (message, data, code = 200) => {
  logger("OK", message);
  return { message, data, code };
};

const dispatchError = (res, managers, message, error) => {
  return managers.responseDispatcher.dispatch(res, {
    ok: false,
    code: 500,
    ...returnError(message, error),
  });
};

const returnError = (message, error) => {
  if (error instanceof CustomError) {
    logger(
      "ERROR",
      `${message}: ${
        error.message.isArray ? JSON.stringify(error.message) : error.message
      } | Code: ${error.code} | Stack: ${
        error.stack || "No stack trace available"
      }`
    );

    return {
      message,
      errors: error.message.isArray ? error.message : [`${error.message}`],
      code: error.code,
    };
  } else {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    const stackTrace =
      error instanceof Error ? error.stack : "No stack trace available";

    // Log the error with context and stack trace
    logger("ERROR", `${message}: ${errorMessage} | Stack: ${stackTrace}`);
    return { error: "An error occurred", code: 500 };
  }
};

/** Helper function to build filter conditions dynamically */
const buildFilterConditions = (filters) => {
  const matchConditions = {};

  // Loop through filters and apply conditions dynamically
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      if (typeof value === "string") {
        matchConditions[key] = new RegExp(value, "i"); // Case-insensitive regex search for strings
      } else {
        matchConditions[key] = value; // Direct match for non-string values
      }
    }
  }

  return matchConditions;
};

/** Helper function to build aggregation pipeline */
const buildAggregationPipeline = (
  matchConditions,
  page,
  limit,
  sortBy,
  sortOrder
) => {
  return [
    {
      $facet: {
        // First part of the pipeline: Fetching the paginated users
        data: [
          { $match: matchConditions }, // Apply dynamic filters
          { $skip: (page - 1) * limit }, // Pagination - skip documents
          { $limit: limit }, // Pagination - limit documents
          { $sort: { [sortBy]: sortOrder } }, // Sorting - dynamic field and order
          {
            $project: {
              __v: 0, // Exclude the __v field from the result
              password: 0, // Exclude the password field from the result for security
            },
          },
        ],
        // Second part of the pipeline: Counting total users (without pagination)
        totalCount: [
          { $match: matchConditions }, // Apply filters again
          { $count: "count" }, // Count the total number of matching users
        ],
      },
    },
  ];
};

const buildPagination = ({ result, page, limit }) => {
  const totalRecords = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalRecords / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  return {
    totalRecords,
    totalPages,
    nextPage,
    prevPage,
  };
};

module.exports = {
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
};
