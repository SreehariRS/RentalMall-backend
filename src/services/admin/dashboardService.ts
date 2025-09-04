import { IDashboardRepository } from "../../repositories/interface/IadminRepositories";
import { IDashboardService, DashboardStats } from "../interface/Iadmin";
import { DashboardMapper } from "../../dto/mappers";

export default class DashboardService implements IDashboardService {
  private _dashboardRepository: IDashboardRepository;

  constructor(dashboardRepository: IDashboardRepository) {
    this._dashboardRepository = dashboardRepository;
  }

  async getDashboardStats(): Promise<import("../../dto/admin").DashboardStatsResponseDto> {
    const stats = await this._dashboardRepository.getDashboardStats();
    // Use DTO mapper to return properly formatted response
    return DashboardMapper.toDashboardStatsResponseDto(stats);
  }
}