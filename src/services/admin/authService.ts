import { IAuthRepository } from "../../repositories/interface/IadminRepositories";
import { IAuthService, Admin } from "../interface/Iadmin";
import jwt from "jsonwebtoken";

interface AdminPayload {
  id: string;
  email: string;
  role: string;
}

// const JWT_SECRET = process.env.JWT_SECRET || "NEXTAUTH_SECRET";
const JWT_SECRET = "NEXTAUTH_SECRET";
const ACCESS_TOKEN_EXPIRY = "1h"; 
const REFRESH_TOKEN_EXPIRY = "7d";

export default class AuthService implements IAuthService {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return await this.authRepository.findByEmail(email);
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    const admin = await this.authRepository.findByEmail(email);
    console.log("Admin retrieved:", admin);
    if (!admin || password !== admin.password) {
      console.log("Login failed: Invalid credentials");
      return null;
    }

    const payload: AdminPayload = { id: admin.id, email: admin.email, role: admin.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    await this.authRepository.updateTokens(admin.id, accessToken, refreshToken);
    console.log("Tokens generated:", { accessToken, refreshToken });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string } | null> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as AdminPayload;
      console.log("Refresh token decoded:", decoded);

      const admin = await this.authRepository.findById(decoded.id);
      if (!admin) {
        console.log("No admin found for ID:", decoded.id);
        return null;
      }

      // Check if the stored refresh token matches the provided one
      if (admin.refreshToken !== refreshToken) {
        console.log("Refresh token mismatch:", { stored: admin.refreshToken, provided: refreshToken });
        return null;
      }

      const payload: AdminPayload = { id: admin.id, email: admin.email, role: admin.role };
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

      await this.authRepository.updateTokens(admin.id, accessToken, refreshToken);
      console.log("New access token issued:", accessToken);
      return { accessToken };
    } catch (error) {
      console.error("Error in refreshToken:", error);
      return null;
    }
  }
}