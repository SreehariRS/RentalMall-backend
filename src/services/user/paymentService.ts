import { Response } from "express";
import { PaymentRepository } from "../../repositories/user/paymentRepository";

export class PaymentService {
    private paymentRepository: PaymentRepository;

    constructor(paymentRepository: PaymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    async createOrder(body: { amount: number; currency?: string }, res: Response): Promise<void> {
        const options = {
            amount: body.amount * 100, // Convert to paise (Razorpay expects amount in smallest unit)
            currency: body.currency || "INR",
            receipt: `txn_${Date.now()}`,
            payment_capture: 1,
        };

        const order = await this.paymentRepository.createOrder(options);
        res.status(200).json({
            order_id: order.id,
            currency: order.currency,
            amount: order.amount,
        });
    }
}