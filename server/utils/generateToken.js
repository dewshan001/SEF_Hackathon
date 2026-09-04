import jwt from "jsonwebtoken";

// Include role in token so middleware can optionally skip a DB lookup
const generateToken = (id, role = "CUSTOMER") => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "30d" }
  );
};

export default generateToken;
