import HostRepository from "../../repositories/admin/hostRepository";
import { PaginatedResponse } from "../interface/Iadmin";

export default class HostService {
    private hostRepository: HostRepository;

    constructor(hostRepository: HostRepository) {
        this.hostRepository = hostRepository;
    }

    async getAllHosts(page: number, limit: number): Promise<PaginatedResponse<{ id: string; name: string; listingCount: number; isRestricted: boolean }>> {
        return await this.hostRepository.getAllHosts(page, limit);
    }
}