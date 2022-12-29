const http = require('http');
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Importing routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const wishlistRoutes = require("./routes/wishlist");
const emailRoutes = require('./routes/email');
const voucherRoutes = require('./routes/voucher')
const subscriberRoutes = require('./routes/subscriber')

// configuring app for socket and HTTPS server
const app = express();
const server = http.createServer(app);

// Configuring CORS
app.use(morgan("tiny"));
app.use(cors());
app.set('view engine', 'ejs')
// Body parser
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
// .env configuration
dotenv.config();
// Morgan configuration

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/wishlist", wishlistRoutes);
app.use('/email', emailRoutes)
app.use('/voucher', voucherRoutes)
app.use('/subscriber', subscriberRoutes)

mongoose
    .connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    });


const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

// socket.io middleware
io.use((socket, next) => {
    const type = socket.handshake.query.type;
    const id = socket.handshake.query.userid;

    if (type && id) {
        socket.type = type;
        socket.userid = id;
        next();
    } else {
        next(new Error('No type or userid specified'));
    }
})

io.on('connection', async (socket) => {
    // make room based on user.type
    socket.join(socket.type);

    // disconnect from room after disconnect
    socket.on('disconnect', async () => {
        socket.leave(socket.type);
    });

    socket.on("orderCreated", async (data) => {
        socket.to("admin").emit("orderCreated", data);
    })
});
