
import { IHostRepository } from "../../repositories/interface/IadminRepositories";
import { IHostService, PaginatedResponse } from "../interface/Iadmin";

export default class HostService implements IHostService {
    private hostRepository: IHostRepository;

    constructor(hostRepository: IHostRepository) {
        this.hostRepository = hostRepository;
    }

    async getAllHosts(page: number, limit: number): Promise<PaginatedResponse<{ id: string; name: string; listingCount: number; isRestricted: boolean }>> {
        return await this.hostRepository.getAllHosts(page, limit);
    }
}