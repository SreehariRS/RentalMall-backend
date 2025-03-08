import AuthRepository from "../../repositories/admin/authRepository";
import { Admin } from "../interface/Iadmin";

export default class AuthService {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async findByEmail(email: string): Promise<Admin | null> {
        return await this.authRepository.findByEmail(email);
    }
}