const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { newQuestionsProxy } = require("./newQuestionsProxy.js");
const setAuthCookie = require("./utils/setAuthCookie");
const db = require("./db.js");

const port = process.argv.length > 2 ? process.argv[2] : 3000;
const authCookieName = "token";

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.set("trust proxy", true);

// Proxy setup
const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
let proxy = newQuestionsProxy(httpService);

// Routers
const apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.use(
  "/auth",
  require("./routes/auth")(db, setAuthCookie, authCookieName)
);
apiRouter.use(require("./middleware/authMiddleware")(db, authCookieName));
apiRouter.use("/questions", require("./routes/questions")(db, proxy));
apiRouter.use("/gpt", require("./routes/gpt"));
apiRouter.use("/star", require("./routes/stars")(db, proxy));

// Fallback to frontend
app.use((_req, res) => {
  res.sendFile("index.html", { root: "public/" });
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});
