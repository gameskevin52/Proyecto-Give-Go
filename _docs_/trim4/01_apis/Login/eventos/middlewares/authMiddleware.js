const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({
      success: false,
      message: "No se proporciono un token",
    });
  }

  const [type, token] = authHeader.split(" ");

  if (!["JWT", "Bearer"].includes(type) || !token) {
    return res.status(403).json({
      success: false,
      message: "Formato de token invalido. Usa: JWT <token>",
    });
  }

  jwt.verify(token, keys.secretOrKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token invalido o expirado",
        error: err,
      });
    }

    req.user = decoded;
    next();
  });
}

function authorizeRoles(roles) {
  const allowedRoles = roles.map((role) => role.toLowerCase());

  return (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase();

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: se requiere rol ${roles.join(" o ")}`,
      });
    }

    next();
  };
}

module.exports = {
  verifyToken,
  authorizeRoles,
};
