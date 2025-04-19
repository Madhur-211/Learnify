const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("🧐 Checking Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No valid token found!");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        console.log("🔍 Verifying Token...");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        console.log("✅ Token Decoded:", decoded);

        if (!decoded.id) {  // 🔥 Ensure 'id' matches how you sign the token
            console.log("❌ Token does not contain user ID");
            return res.status(401).json({ message: "Unauthorized: Token invalid" });
        }

        req.user = { id: decoded.id, role: decoded.role }; // ✅ Include 'role' for access control
        next();
    } catch (error) {
        console.error("❌ JWT Verification Failed:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
    }
};
