"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
const userRouter = (db) => {
    router.post("/login", (req, res) => {
        console.log("Received login request!", req.body);
        db.user
            .findOne({ where: { email: req.body.email } })
            .then((response) => {
            console.log("ORM search completed: ", req.body);
            if (!response) {
                return res.send("Invalid email or password.");
            }
            if (!bcryptjs_1.default.compareSync(req.body.password, response.dataValues.password)) {
                return res.send("Invalid email or password.");
            }
            req.session.userID = response.dataValues.id;
            res.status(200).json({ userID: req.session.userID });
        })
            .catch((err) => console.error(err));
    });
    router.post("/logout", (req, res) => {
        console.log("Received logout request!");
        req.session.userID = null;
        console.log("Confirm user session is empty: ", req.session.userID);
        res.status(200).send("You have already logged out! See you!");
    });
    router.post("/register", (req, res) => {
        console.log("Received registration request!", req.body);
        const salt = bcryptjs_1.default.genSaltSync(10);
        const password = bcryptjs_1.default.hashSync(req.body.password, salt);
        db.user
            .create({
            username: req.body.username,
            password,
            email: req.body.email,
            createAt: new Date(),
            updatedAt: new Date(),
        })
            .then((response) => {
            console.log("Created user: " + response.id);
            req.session.userID = response.id;
            res.json(response);
        })
            .catch((err) => console.error(err));
    });
    return router;
};
exports.default = userRouter;