
import jwt from "jsonwebtoken"

//User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    // console.log(token)
    if (!token) {
      return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("Auth Middleware - initial req.body:", req.body);
// 
    // Attach userId to req.body
    // req.body.userId = token_decode.id;
     req.user = { id: token_decode.id };  // Attach here instead of req.body


    // console.log("Auth Middleware - modified req.body:", req.body);

    next();
  } catch (error) {
    console.error("Auth Middleware error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser