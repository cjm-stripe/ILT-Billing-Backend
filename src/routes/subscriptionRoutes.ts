import express from "express";
import {
    getSubscription,
    upgradeSubscription,
    downgradeSubscription,
} from "../controllers/subscriptionController";

const router = express.Router();

router.get("/get-subscription/:id", getSubscription);
router.post("/upgrade-subscription", upgradeSubscription);
router.post("/downgrade-subscription", downgradeSubscription);

export default router;
