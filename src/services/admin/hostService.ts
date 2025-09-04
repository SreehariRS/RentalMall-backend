import { IHostRepository } from "../../repositories/interface/IadminRepositories";
import { IHostService } from "../interface/Iadmin";
import { HostMapper } from "../../dto/mappers";

export default class HostService implements IHostService {
  private _hostRepository: IHostRepository;

  constructor(hostRepository: IHostRepository) {
    this._hostRepository = hostRepository;
  }

  async getAllHosts(page: number, limit: number): Promise<import("../../dto/admin").HostListResponseDto> {
    const paginatedHosts = await this._hostRepository.getAllHosts(page, limit);
    // Use DTO mapper to return properly formatted response
    return HostMapper.toHostListResponseDto(paginatedHosts);
  }
}