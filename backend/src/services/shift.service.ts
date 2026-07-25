import { ShiftRepository } from '../repositories/shift.repository';
import { WorkerService } from './worker.service';
import { ShiftWithWorker } from '../models/shift.model';
import { ConflictError } from '../errors/conflict.error';
import { NotFoundError } from '../errors/not-found.error';

function toLocalDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toLocalDateTimeStr(date: Date): string {
  const dateStr = toLocalDateStr(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}:${seconds}`;
}

export class ShiftService {
  constructor(
    private readonly shiftRepository: ShiftRepository,
    private readonly workerService: WorkerService,
  ) {}

  async startShift(workerCode: string): Promise<ShiftWithWorker> {
    const worker = await this.workerService.getWorkerByCodeOrFail(workerCode);

    const existingActiveShift = await this.shiftRepository.findActiveByWorkerId(worker.id);
    if (existingActiveShift) {
      throw new ConflictError(
        'SHIFT_ALREADY_ACTIVE',
        `El trabajador "${workerCode}" ya tiene una jornada activa en curso`,
      );
    }

    const now = new Date();
    const date = toLocalDateStr(now);
    const startTime = toLocalDateTimeStr(now);

    const shiftId = await this.shiftRepository.create(worker.id, workerCode, date, startTime);

    const shift = await this.shiftRepository.findByIdWithWorker(shiftId);
    return shift!;
  }

  async endShift(shiftId: string): Promise<ShiftWithWorker> {
    const shift = await this.shiftRepository.findByIdWithWorker(shiftId);

    if (!shift) {
      throw new NotFoundError(
        'SHIFT_NOT_FOUND',
        `No existe una jornada con el ID ${shiftId}`,
      );
    }

    if (shift.status === 'completed') {
      throw new ConflictError(
        'SHIFT_ALREADY_COMPLETED',
        'Esta jornada ya ha sido finalizada previamente',
      );
    }

    const now = new Date();
    const endTime = toLocalDateTimeStr(now);
    const startDate = new Date(shift.start_time.replace(' ', 'T'));
    const totalSeconds = Math.floor((now.getTime() - startDate.getTime()) / 1000);

    await this.shiftRepository.complete(shiftId, endTime, totalSeconds);

    const updatedShift = await this.shiftRepository.findByIdWithWorker(shiftId);
    return updatedShift!;
  }

  async getActiveShift(workerCode: string): Promise<ShiftWithWorker | null> {
    await this.workerService.getWorkerByCodeOrFail(workerCode);
    return this.shiftRepository.findActiveByWorkerCode(workerCode);
  }

  async getShiftHistory(workerCode: string): Promise<ShiftWithWorker[]> {
    await this.workerService.getWorkerByCodeOrFail(workerCode);
    return this.shiftRepository.findAllByWorkerCode(workerCode);
  }

  async getAllShifts(): Promise<ShiftWithWorker[]> {
    return this.shiftRepository.findAll();
  }
}
