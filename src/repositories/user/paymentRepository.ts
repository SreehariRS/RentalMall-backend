
import { razorpay } from "../../config/razorPay";
import { IPaymentRepository } from "../interface/IUserRepositories";

export class PaymentRepository implements IPaymentRepository {
    async createOrder(options: { amount: number; currency: string; receipt: string; payment_capture: number }): Promise<{ id: string; currency: string; amount: number }> {
        try {
            const order = await razorpay.orders.create(options);
            return { id: order.id as string, currency: order.currency as string, amount: Number(order.amount) };
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            throw error;
        }
    }
}