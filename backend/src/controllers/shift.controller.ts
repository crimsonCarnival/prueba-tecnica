import { Request, Response, NextFunction } from 'express';
import { ShiftService } from '../services/shift.service';
import { startShiftSchema, shiftIdParamSchema, workerCodeParamSchema } from '../validators/shift.validator';
import { ValidationError } from '../errors/validation.error';
import { successResponse } from '../dtos/api-response.dto';
import { toShiftResponseDto } from '../dtos/shift.dto';

export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  startShift = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = startShiftSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new ValidationError(parsed.error.errors[0].message));
    }

    try {
      const shift = await this.shiftService.startShift(parsed.data.workerCode);
      res.status(201).json(successResponse(toShiftResponseDto(shift)));
    } catch (error) {
      next(error);
    }
  };

  endShift = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = shiftIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      return next(new ValidationError(parsed.error.errors[0].message));
    }

    try {
      const shift = await this.shiftService.endShift(parsed.data.id);
      res.status(200).json(successResponse(toShiftResponseDto(shift)));
    } catch (error) {
      next(error);
    }
  };

  getActiveShift = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = workerCodeParamSchema.safeParse(req.params);
    if (!parsed.success) {
      return next(new ValidationError(parsed.error.errors[0].message));
    }

    try {
      const shift = await this.shiftService.getActiveShift(parsed.data.workerCode);
      res.status(200).json(successResponse(shift ? toShiftResponseDto(shift) : null));
    } catch (error) {
      next(error);
    }
  };

  getShiftHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = workerCodeParamSchema.safeParse(req.params);
    if (!parsed.success) {
      return next(new ValidationError(parsed.error.errors[0].message));
    }

    try {
      const shifts = await this.shiftService.getShiftHistory(parsed.data.workerCode);
      res.status(200).json(successResponse(shifts.map(toShiftResponseDto)));
    } catch (error) {
      next(error);
    }
  };

  getAllShifts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const shifts = await this.shiftService.getAllShifts();
      res.status(200).json(successResponse(shifts.map(toShiftResponseDto)));
    } catch (error) {
      next(error);
    }
  };
}
