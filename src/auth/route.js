const handler = require("./handler");

module.exports = [
  {
    method: "POST",
    path: "/register",
    handler: handler.register,
  },
  {
    method: "POST",
    path: "/login",
    handler: handler.login,
  },
  {
    method: "POST",
    path: "/login/google",
    handler: handler.loginWithGoogle,
  },
  {
    method: "POST",
    path: "/request-password-reset",
    handler: handler.requestPasswordReset,
  },
  {
    method: "POST",
    path: "/reset-password",
    handler: handler.resetPassword,
  },
];
