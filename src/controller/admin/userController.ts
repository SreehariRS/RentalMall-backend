import { Request, Response } from "express";
import { IUserService } from "../../services/interface/Iadmin";
import { IUserController } from "../interface/IadminController";
import { UserSearchQueryDto } from "../../dto/admin";
import { HttpStatusCodes } from "../../config/HttpStatusCodes";
import { Messages } from "../../config/message";

export class UserController implements IUserController {
  private _userService: IUserService;

  constructor(userService: IUserService) {
    this._userService = userService;
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const searchQuery = req.query.search as string | undefined;
      
      const queryParams: UserSearchQueryDto = { page, limit, searchQuery };
      const paginatedData = await this._userService.getAllUsers(
        queryParams.page, 
        queryParams.limit, 
        queryParams.searchQuery
      );
      res.status(HttpStatusCodes.OK).json(paginatedData);
    } catch (error) {
      let errorMessage: string = Messages.UNEXPECTED_ERROR_USERS;
      if (error instanceof Error) errorMessage = error.message;
      console.error("Error details:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.USER_ID_REQUIRED });
        return;
      }
      
      const user = await this._userService.blockUser(userId);
      if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });
        return;
      }
      res.status(HttpStatusCodes.OK).json({ message: Messages.USER_BLOCKED_SUCCESS, user });
    } catch (error) {
      let errorMessage: string = Messages.UNEXPECTED_ERROR_BLOCKING_USER;
      if (error instanceof Error) errorMessage = error.message;
      console.error("Error details:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
  }

  async unblockUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.USER_ID_REQUIRED });
        return;
      }
      
      const user = await this._userService.unblockUser(userId);
      if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });
        return;
      }
      res.status(HttpStatusCodes.OK).json({ message: Messages.USER_UNBLOCKED_SUCCESS, user });
    } catch (error) {
      let errorMessage: string = Messages.UNEXPECTED_ERROR_UNBLOCKING_USER;
      if (error instanceof Error) errorMessage = error.message;
      console.error("Error details:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
  }

  async restrictHost(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.USER_ID_REQUIRED });
        return;
      }
      
      const user = await this._userService.restrictHost(userId);
      if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ message: Messages.HOST_NOT_FOUND });
        return;
      }
      res.status(HttpStatusCodes.OK).json({ message: Messages.HOST_RESTRICTED_SUCCESS, user });
    } catch (error) {
      let errorMessage: string = Messages.UNEXPECTED_ERROR_RESTRICTING_HOST;
      if (error instanceof Error) errorMessage = error.message;
      console.error("Error details:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
  }

  async unrestrictHost(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: Messages.USER_ID_REQUIRED });
        return;
      }
      
      const user = await this._userService.unrestrictHost(userId);
      if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ message: Messages.HOST_NOT_FOUND });
        return;
      }
      res.status(HttpStatusCodes.OK).json({ message: Messages.HOST_UNRESTRICTED_SUCCESS, user });
    } catch (error) {
      let errorMessage: string = Messages.UNEXPECTED_ERROR_UNRESTRICTING_HOST;
      if (error instanceof Error) errorMessage = error.message;
      console.error("Error details:", error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
  }
}