import { WorkerRepository } from '../repositories/worker.repository';
import { Worker } from '../models/worker.model';
import { NotFoundError } from '../errors/not-found.error';

export class WorkerService {
  constructor(private readonly workerRepository: WorkerRepository) {}

  async getWorkerByCodeOrFail(code: string): Promise<Worker> {
    const worker = await this.workerRepository.findByCode(code);
    if (!worker) {
      throw new NotFoundError(
        'WORKER_NOT_FOUND',
        `No existe un trabajador con el código "${code}"`,
      );
    }
    return worker;
  }
}
