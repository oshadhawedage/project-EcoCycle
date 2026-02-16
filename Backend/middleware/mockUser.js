// backend/middlewares/mockUser.js
export const mockUser = (req, res, next) => {
  req.user = {
    _id: "64123456789abcdef1234567", // some dummy ObjectId
    name: "Test User",
    email: "test@example.com",
    role: "user"
  };
  next();
};