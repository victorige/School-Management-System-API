const mongoose = require("mongoose");

module.exports = ({ meta, config, managers, validators, utils }) => {
  return async ({ req, res, next }) => {
    try {
      const { id } = req.params;
      const moduleName = meta?.moduleName || "UnknownModule";
      const fnName = meta?.fnName || "UnknownFunction";

      utils.logger("INFO", `Validating ObjectId for ${moduleName}:${fnName}`);

      if (!id) return utils.throwError(`Missing 'id' parameter`, 400);

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id))
        return utils.throwError(`Invalid 'id' parameter format`, 400);

      utils.logger("SUCCESS", `Valid ObjectId: ${id}`);
      next(req.params);
    } catch (error) {
      utils.logger("ERROR", `Validation failed: ${error.message}`);
      return utils.dispatchError(res, managers, "Validation failed", error);
    }
  };
};
