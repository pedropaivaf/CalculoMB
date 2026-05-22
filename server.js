const express = require('express');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');
const { exec } = require('child_process');

const app = express();
const PORT = 3847;
let db, dbPath;

async function initDB() {
  // Carrega WASM como buffer — funciona tanto em dev quanto no EXE (pkg)
  const wasmPath = path.join(__dirname, 'node_modules/sql.js/dist/sql-wasm.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const SQL = await initSqlJs({ wasmBinary });

  // Em app empacotado (Electron), salva no %APPDATA% do usuário
  let dataDir = __dirname;
  try {
    const { app } = require('electron');
    if (app && app.getPath) {
      dataDir = app.getPath('userData');
    }
  } catch (err) {
    dataDir = process.pkg ? path.dirname(process.execPath) : __dirname;
  }
  dbPath = path.join(dataDir, 'simulacoes.db');

  db = fs.existsSync(dbPath)
    ? new SQL.Database(fs.readFileSync(dbPath))
    : new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS simulacoes (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      criado_em         DATETIME DEFAULT CURRENT_TIMESTAMP,
      nome              TEXT DEFAULT 'Simulação',
      regime            TEXT,
      faturamento_anual REAL,
      funcionarios      INTEGER,
      setor             TEXT,
      unidades          INTEGER,
      automacao         TEXT,
      risco             TEXT,
      cpe               TEXT,
      piso_escritorio   REAL,
      onboarding        INTEGER,
      planejamento      INTEGER,
      bpo_cfo           INTEGER,
      bpo_pct           REAL,
      plano_recomendado TEXT,
      valor_minimo      REAL,
      valor_medio       REAL,
      valor_alto        REAL,
      total_recomendado REAL,
      score_confianca   INTEGER
    )
  `);
  saveDB();
}

function saveDB() {
  fs.writeFileSync(dbPath, Buffer.from(db.export()));
}

function rowsToObjects(result) {
  if (!result || !result.length) return [];
  const { columns, values } = result[0];
  return values.map(row => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
}

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'calculadora.html')));

// ── REST API ──────────────────────────────────────────────────

app.get('/api/simulacoes', (_, res) => {
  res.json(rowsToObjects(db.exec('SELECT * FROM simulacoes ORDER BY criado_em DESC')));
});

app.post('/api/simulacoes', (req, res) => {
  const s = req.body;
  db.run(
    `INSERT INTO simulacoes (
      nome, regime, faturamento_anual, funcionarios, setor, unidades,
      automacao, risco, cpe, piso_escritorio, onboarding, planejamento,
      bpo_cfo, bpo_pct, plano_recomendado, valor_minimo, valor_medio,
      valor_alto, total_recomendado, score_confianca
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      s.nome, s.regime, s.faturamento_anual, s.funcionarios, s.setor, s.unidades,
      s.automacao, s.risco, s.cpe, s.piso_escritorio, s.onboarding, s.planejamento,
      s.bpo_cfo, s.bpo_pct, s.plano_recomendado, s.valor_minimo, s.valor_medio,
      s.valor_alto, s.total_recomendado, s.score_confianca,
    ]
  );
  const id = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
  saveDB();
  res.json({ id });
});

app.delete('/api/simulacoes/:id', (req, res) => {
  db.run('DELETE FROM simulacoes WHERE id = ?', [Number(req.params.id)]);
  saveDB();
  res.json({ ok: true });
});

// ── START ─────────────────────────────────────────────────────

const { EventEmitter } = require('events');
const readyEmitter = new EventEmitter();

initDB().then(() => {
  const server = app.listen(PORT, '127.0.0.1', () => {
    const url = `http://localhost:${PORT}`;
    console.log(`\n  Calculadora de Honorários rodando em ${url}\n`);
    if (!process.versions.electron) exec(`start "" "${url}"`);
    readyEmitter.emit('ready');
  });
  server.on('error', (err) => readyEmitter.emit('error', err));
}).catch(err => {
  console.error('Erro ao iniciar:', err);
  process.exit(1);
});

module.exports = readyEmitter;
