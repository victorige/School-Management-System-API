module.exports = ({ meta, config, managers, validators, utils }) => {
  return async ({ req, res, next }) => {
    // Validate request data
    try {
      const { moduleName, fnName } = req.params;

      utils.logger(
        "INFO",
        `Received request to validate ${moduleName}:${fnName}`
      );

      // Check if the validator exists for the given module and function name
      const validate = validators[moduleName]?.[fnName];

      if (!validate)
        return utils.throwError(
          `Validator not found for ${moduleName}:${fnName}`,
          500
        );

      const requestData = req.body;

      utils.logger("INFO", "Validating request data...");

      const validationErrors = utils.getValidationErrors(
        await validate(requestData)
      );

      if (validationErrors) return utils.throwError(validationErrors, 400);

      utils.logger("INFO", `Validation successful for ${moduleName}:${fnName}`);
      next(req.body); // Proceed to the next middleware or handler
    } catch (error) {
      return utils.dispatchError(res, managers, "Validation failed", error);
    }
  };
};
