import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../database/connection';
import { Shift, ShiftWithWorker } from '../models/shift.model';

export class ShiftRepository {
  async findActiveByWorkerId(workerId: string): Promise<Shift | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM shifts WHERE worker_id = ? AND status = 'active' LIMIT 1",
      [workerId],
    );
    return (rows[0] as Shift) ?? null;
  }

  async findByIdWithWorker(shiftId: string): Promise<ShiftWithWorker | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT s.*, w.name AS worker_name
       FROM shifts s
       INNER JOIN workers w ON w.id = s.worker_id
       WHERE s.id = ?
       LIMIT 1`,
      [shiftId],
    );
    return (rows[0] as ShiftWithWorker) ?? null;
  }

  async findActiveByWorkerCode(workerCode: string): Promise<ShiftWithWorker | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT s.*, w.name AS worker_name
       FROM shifts s
       INNER JOIN workers w ON w.id = s.worker_id
       WHERE s.worker_code = ? AND s.status = 'active'
       LIMIT 1`,
      [workerCode],
    );
    return (rows[0] as ShiftWithWorker) ?? null;
  }

  async findAllByWorkerCode(workerCode: string): Promise<ShiftWithWorker[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT s.*, w.name AS worker_name
       FROM shifts s
       INNER JOIN workers w ON w.id = s.worker_id
       WHERE s.worker_code = ?
       ORDER BY s.start_time DESC`,
      [workerCode],
    );
    return rows as ShiftWithWorker[];
  }

  async create(
    workerId: string,
    workerCode: string,
    date: string,
    startTime: string,
  ): Promise<string> {
    const id = uuidv4();
    await pool.query(
      "INSERT INTO shifts (id, worker_id, worker_code, date, start_time, status) VALUES (?, ?, ?, ?, ?, 'active')",
      [id, workerId, workerCode, date, startTime],
    );
    return id;
  }

  async complete(
    shiftId: string,
    endTime: string,
    totalSeconds: number,
  ): Promise<void> {
    await pool.query(
      "UPDATE shifts SET end_time = ?, total_seconds = ?, status = 'completed' WHERE id = ?",
      [endTime, totalSeconds, shiftId],
    );
  }

  async findAll(): Promise<ShiftWithWorker[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT s.*, w.name AS worker_name
       FROM shifts s
       INNER JOIN workers w ON w.id = s.worker_id
       ORDER BY s.start_time DESC`,
    );
    return rows as ShiftWithWorker[];
  }
}
