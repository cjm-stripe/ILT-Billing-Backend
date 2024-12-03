import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
    authRoutes,
    productRoutes,
    priceRoutes,
    checkoutRoutes,
    webhookRoutes,
    subscriptionRoutes,
    customerRoutes,
} from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use("/webhook", webhookRoutes);
app.use(express.json());

// Use imported routes
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/price", priceRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/customer", customerRoutes);


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
