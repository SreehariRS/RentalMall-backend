export interface UserProfileDto {
	id: string;
	name: string;
	email: string;
	image?: string | null;
	about?: string | null;
	isBlocked?: boolean;
}

export interface UpdateProfileImageRequestDto {
	userId: string;
	imageUrl: string;
}

export interface UpdateAboutRequestDto {
	userId: string;
	about: string;
}
