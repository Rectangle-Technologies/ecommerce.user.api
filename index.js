const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();
app.use(morgan("tiny"));

app.use("/auth", authRoutes);

app.use("/", (req, res, next) => {
  res.status(200).json({ message: "Hello" });
});

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
