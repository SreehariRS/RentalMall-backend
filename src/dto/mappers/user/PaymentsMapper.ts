import { CreateOrderResponseDto } from "../../user";

export class PaymentsMapper {
	static toCreateOrderResponseDto(order: { id: string; currency: string; amount: number }): CreateOrderResponseDto {
		return {
			order_id: order.id,
			currency: order.currency,
			amount: order.amount,
		};
	}
}
