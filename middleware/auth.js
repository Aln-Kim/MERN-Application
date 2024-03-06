import jwt from 'jsonwebtoken';

export const verifyToken = async(req, res, next) => {
    try{
        //From front-end request- grabbing Authoriz
        let token = req.header("Authorization");

        if (!token){
            return res.status(403).send("Access Denied");
        }

        //Want to start with Bearer (set from frontend) to place token after it (7 spaces)
        if (token.starsWith("Bearer ")){
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};