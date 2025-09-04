export interface CreateOrderRequestDto {
	amount: number;
	currency?: string;
}

export interface CreateOrderResponseDto {
	order_id: string;
	currency: string;
	amount: number;
}
