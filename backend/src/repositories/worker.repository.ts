import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../database/connection';
import { Worker } from '../models/worker.model';

export class WorkerRepository {
  async findByCode(code: string): Promise<Worker | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM workers WHERE code = ? LIMIT 1',
      [code],
    );
    return (rows[0] as Worker) ?? null;
  }

  async create(code: string, name: string): Promise<string> {
    const id = uuidv4();
    await pool.query('INSERT INTO workers (id, code, name) VALUES (?, ?, ?)', [id, code, name]);
    return id;
  }
}
