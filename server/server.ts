import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;
const distDir = path.resolve('dist');

app.use(express.static(distDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Game running at http://localhost:${PORT}`);
});
