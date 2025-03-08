import { Request, Response } from "express";
import HostService from "../../services/admin/hostService";

export class HostController {
    private hostService: HostService;

    constructor(hostService: HostService) {
        this.hostService = hostService;
    }

    async getAllHosts(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const paginatedData = await this.hostService.getAllHosts(page, limit);
            res.status(200).json(paginatedData);
        } catch (error) {
            let errorMessage = "An unexpected error occurred while fetching hosts";
            if (error instanceof Error) errorMessage = error.message;
            console.error("Error details:", error);
            res.status(500).json({ message: errorMessage });
        }
    }
}