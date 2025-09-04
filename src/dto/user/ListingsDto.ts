export interface ListingDto {
	id: string;
	title: string;
	description: string;
	imageSrc: string[];
	category: string;
	roomCount: number;
	guestCount: number;
	location: { value: string } | any;
	price: number;
	userId: string;
}

export interface ListingListResponseDto {
	listings: ListingDto[];
}

export interface ListingResponseDto extends ListingDto {}

export interface UpdateMessageResponseDto {
	message: string;
}

export interface DeleteResultDto {
	count: number;
}

export interface UpdateListingRequestDto {
	category: string;
	imageSrc: string[];
	title: string;
	description: string;
	price: number | string;
}
