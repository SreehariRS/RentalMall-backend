import { Request, Response } from "express";
import { IPaymentService } from "../../services/interface/Iuser";
import { IPaymentController } from "../interface/IuserController";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class PaymentController implements IPaymentController {
    private _paymentService: IPaymentService;

    constructor(paymentService: IPaymentService) {
        this._paymentService = paymentService;
    }

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            await this._paymentService.createOrder(req.body, res);
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: Messages.FAILED_TO_CREATE_ORDER });
        }
    }
}