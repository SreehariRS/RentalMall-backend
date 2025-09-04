import { User } from "@prisma/client";
import { UserProfileDto } from "../../user";

export class ProfileMapper {
	static toUserProfileDto(user: User): UserProfileDto {
		return {
			id: user.id,
			name: user.name ?? "",
			email: user.email ?? "",
			image: user.image ?? null,
			about: (user as any).about ?? null,
			isBlocked: (user as any).isBlocked ?? false,
		};
	}
}
