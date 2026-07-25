import { Router } from 'express';
import { ShiftController } from '../controllers/shift.controller';
import { ShiftService } from '../services/shift.service';
import { WorkerService } from '../services/worker.service';
import { ShiftRepository } from '../repositories/shift.repository';
import { WorkerRepository } from '../repositories/worker.repository';

const workerRepository = new WorkerRepository();
const shiftRepository = new ShiftRepository();
const workerService = new WorkerService(workerRepository);
const shiftService = new ShiftService(shiftRepository, workerService);
const shiftController = new ShiftController(shiftService);

const router = Router();

router.post('/start', shiftController.startShift);
router.patch('/:id/end', shiftController.endShift);
router.get('/report', shiftController.getAllShifts);
router.get('/active/:workerCode', shiftController.getActiveShift);
router.get('/history/:workerCode', shiftController.getShiftHistory);

export { router as shiftRoutes };
