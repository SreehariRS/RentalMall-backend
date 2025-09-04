import { Request, Response } from "express";

export interface IAuthController {
    login(req: Request, res: Response): Promise<void>;
    refresh(req: Request, res: Response): Promise<void>;
}

export interface IUserController {
    getAllUsers(req: Request, res: Response): Promise<void>;
    blockUser(req: Request, res: Response): Promise<void>;
    unblockUser(req: Request, res: Response): Promise<void>;
    restrictHost(req: Request, res: Response): Promise<void>;
    unrestrictHost(req: Request, res: Response): Promise<void>;
}

export interface IReservationController {
    getAllReservations(req: Request, res: Response): Promise<void>;
}

export interface IHostController {
    getAllHosts(req: Request, res: Response): Promise<void>;
}

export interface IDashboardController {
    getDashboardStats(req: Request, res: Response): Promise<void>;
}