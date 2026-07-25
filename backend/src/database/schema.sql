CREATE DATABASE IF NOT EXISTS jornada_laboral CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jornada_laboral;

CREATE TABLE IF NOT EXISTS workers (
  id CHAR(36) NOT NULL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shifts (
  id CHAR(36) NOT NULL PRIMARY KEY,
  worker_id CHAR(36) NOT NULL,
  worker_code VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NULL,
  total_seconds INT NULL,
  status ENUM('active', 'completed') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (worker_id) REFERENCES workers(id),
  INDEX idx_shifts_worker_id (worker_id),
  INDEX idx_shifts_status (status),
  INDEX idx_shifts_worker_status (worker_id, status)
);

INSERT IGNORE INTO workers (id, code, name) VALUES
  (UUID(), '1000', 'Juan Pérez'),
  (UUID(), '1001', 'María García'),
  (UUID(), '1002', 'Carlos López');
