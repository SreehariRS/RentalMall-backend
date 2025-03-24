import { Request, Response } from "express";
import { IPaymentService } from "../../services/interface/Iuser";
import { IPaymentController } from "../interface/IuserController";

export class PaymentController implements IPaymentController {
    private paymentService: IPaymentService;

    constructor(paymentService: IPaymentService) {
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