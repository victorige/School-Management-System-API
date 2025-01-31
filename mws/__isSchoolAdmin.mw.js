module.exports = ({ meta, config, managers, validators, utils }) => {
  return async ({ req, res, next }) => {
    try {
      if (req.user.role !== "school_admin")
        return utils.throwError(
          "User does not have school_admin privileges",
          403
        );

      utils.logger(
        "INFO",
        `User with role ${req.user} is authorized to proceed.`
      );

      next(true);
    } catch (error) {
      return utils.dispatchError(res, managers, "Permission denied", error);
    }
  };
};
