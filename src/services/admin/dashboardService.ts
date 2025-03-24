import DashboardRepository from "../../repositories/admin/dashboardRepository";
import { IDashboardService, DashboardStats } from "../interface/Iadmin";

export default class DashboardService implements IDashboardService {
    private dashboardRepository: DashboardRepository;

    constructor(dashboardRepository: DashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    async getDashboardStats(): Promise<DashboardStats> {
        return await this.dashboardRepository.getDashboardStats();
    }
}