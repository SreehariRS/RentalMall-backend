import { BaseRepository } from "../baseRepository";
import { Admin } from "../../services/interface/Iadmin";

export default class AuthRepository extends BaseRepository {
    async findByEmail(email: string): Promise<Admin | null> {
        try {
            const admin = await this.prisma.admin.findUnique({
                where: { email },
                select: { id: true, email: true, password: true },
            });
            if (!admin) return null;
            return { id: admin.id, email: admin.email, password: admin.password };
        } catch (error) {
            this.handleError(error, "findByEmail");
        }
    }
}