"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImplementation = void 0;
const prismadb_1 = __importDefault(require("../libs/prismadb"));
class UserRepositoryImplementation {
    // Add a listing to the user's favorites
    async addFavorite(userId, listingId) {
        const user = await prismadb_1.default.user.update({
            where: { id: userId },
            data: { favoriteIds: { push: listingId } },
        });
        return user;
    }
    // Remove a listing from the user's favorites
    async removeFavorite(userId, listingId) {
        const user = await prismadb_1.default.user.update({
            where: { id: userId },
            data: {
                favoriteIds: {
                    set: (await prismadb_1.default.user.findUnique({ where: { id: userId } }))?.favoriteIds.filter((id) => id !== listingId),
                },
            },
        });
        return user;
    }
    //profile
    async findByEmail(email) {
        console.log("Finding user with email:", email); // Debug log
        const getUser = await prismadb_1.default.user.findUnique({
            where: { email },
        });
        console.log("User found:", getUser); // Debug log
        return getUser;
    }
}
exports.UserRepositoryImplementation = UserRepositoryImplementation;
