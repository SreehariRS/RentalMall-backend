import { razorpay } from "../../config/razorPay";
import { BaseRepository } from "../baseRepository";

export class PaymentRepository extends BaseRepository {
    async createOrder(options: { amount: number; currency: string; receipt: string; payment_capture: number }): Promise<any> {
        try {
            return await razorpay.orders.create(options);
        } catch (error) {
            this.handleError(error, "createOrder");
        }
    }
}