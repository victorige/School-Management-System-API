module.exports = ({ meta, config, managers, validators, utils }) => {
  return async ({ req, res, next }) => {
    try {
      if (req.user.role !== "super_admin")
        return utils.throwError(
          "User does not have super_admin privileges",
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
