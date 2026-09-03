-- AI-Powered Smart Court Case Management Platform - Schema
CREATE DATABASE IF NOT EXISTS court_platform;
USE court_platform;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','judge','clerk','citizen') NOT NULL DEFAULT 'citizen',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  case_type ENUM('Criminal','Civil','Family','Property','Corporate','Constitutional','Tax','Labor') NOT NULL,
  status ENUM('filed','in_progress','scheduled','closed') DEFAULT 'filed',
  priority ENUM('low','medium','high','urgent') DEFAULT 'medium',
  judge_id INT,
  filed_by INT,
  filed_date DATE NOT NULL,
  predicted_completion_date DATE,
  actual_completion_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (judge_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (filed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_text MEDIUMTEXT,
  redacted_text MEDIUMTEXT,
  category VARCHAR(100),
  confidence DECIMAL(5,2),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

CREATE TABLE hearings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  judge_id INT NOT NULL,
  hearing_date DATE NOT NULL,
  hearing_time TIME NOT NULL,
  room VARCHAR(50),
  status ENUM('scheduled','completed','postponed','cancelled') DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (judge_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE precedents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  citation VARCHAR(150),
  category VARCHAR(100),
  summary TEXT,
  keywords TEXT
);

CREATE TABLE case_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

INSERT INTO precedents (title, citation, category, summary, keywords) VALUES
('State v. Rahman', 'CRL-2019-0042', 'Criminal', 'Landmark ruling on admissibility of digital evidence in criminal trials.', 'digital evidence,criminal,admissibility,cybercrime'),
('Sharma v. Sharma', 'FAM-2018-0117', 'Family', 'Precedent on equitable division of jointly held property during divorce.', 'divorce,property division,family,alimony'),
('Kumar Textiles v. State Revenue Board', 'TAX-2020-0203', 'Tax', 'Clarified input tax credit eligibility for manufacturing units.', 'tax credit,gst,manufacturing,revenue'),
('Global Corp v. Innotech Ltd', 'COM-2021-0330', 'Corporate', 'Ruling on breach of contract and liquidated damages calculation.', 'contract breach,damages,corporate,arbitration'),
('Verma v. Municipal Corporation', 'PROP-2017-0088', 'Property', 'Established standard for compensation in land acquisition disputes.', 'land acquisition,compensation,property,eminent domain'),
('Iyer v. Textile Union', 'LAB-2019-0154', 'Labor', 'Addressed wrongful termination and reinstatement remedies.', 'wrongful termination,labor,reinstatement,union');
