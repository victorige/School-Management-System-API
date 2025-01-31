module.exports = ({ meta, config, managers, validators, utils }) => {
  return async ({ req, res, next }) => {
    try {
      const startTime = Date.now(); // Track the time for performance monitoring

      // Log incoming request details
      utils.logger(
        "INFO",
        `Incoming request for ${req.method} ${req.originalUrl}`
      );

      const token = req.header("Authorization");

      if (!token) return utils.throwError("No token provided", 401);

      const extractToken = token.split(" ")[1];

      if (!extractToken)
        return utils.throwError("Token format is invalid", 401);

      // Log token verification attempt
      utils.logger("INFO", "Attempting to verify authorization token");

      // Attempt to verify the token and decode it
      const decoded = managers.token.verifyAuthToken(extractToken);

      if (!decoded) return utils.throwError("Invalid token", 401);

      // Check if the token has expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decoded.exp && decoded.exp < currentTime) {
        return utils.throwError("Token has expired", 401);
      }

      // Log success in token verification
      utils.logger("OK", "Authorization token verified successfully");

      // Log performance data
      const endTime = Date.now();
      utils.logger(
        "INFO",
        `Authorization process took ${endTime - startTime}ms`
      );

      req.user = decoded.user;
      next({ user: decoded.user }); // Pass decoded user data to the next middleware
    } catch (error) {
      // Handle any unexpected errors
      return utils.dispatchError(res, managers, "Unauthorized", error);
    }
  };
};
