import DashboardRepository from "../../repositories/admin/dashboardRepository";

export default class DashboardService {
    private dashboardRepository: DashboardRepository;

    constructor(dashboardRepository: DashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    async getDashboardStats() {
        return await this.dashboardRepository.getDashboardStats();
    }
}