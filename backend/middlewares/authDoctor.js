import jwt from "jsonwebtoken";

//doctro authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
        // console.log("dtoken not found")
        return res.json({
            success: false,
            message: "Not Authorized. Login Again",
        });
    }
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

    // console.log("Auth Middleware - initial req.body:", req.body);
    // Attach userId to req.body
    // req.body.userId = token_decode.id;
    // req.body.docId = token_decode.id // Attach here instead of req.body
// console.log("token_decode",token_decode)
    req.docId = token_decode.id;
// console.log("docId",req.docId)
    // console.log("Auth Middleware - modified req.body:", req.body);

    next();
  } catch (error) {
    console.error("Auth Middleware error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
