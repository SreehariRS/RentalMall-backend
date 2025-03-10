import { Request, Response } from "express";
import { PaymentService } from "../../services/user/paymentService";

export class PaymentController {
    private paymentService: PaymentService;

    constructor(paymentService: PaymentService) {
        this.paymentService = paymentService;
    }

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            await this.paymentService.createOrder(req.body, res);
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({ error: "Failed to create order" });
        }
    }
}