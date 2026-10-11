const express = require('express');
const logger = require('./middlewares/logger');
const taskRoutes = require('./routes/taskRoutes');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ message: 'Mağaza Görev ve Onarım Takip API çalışıyor' });
});
app.use('/api/tasks', taskRoutes);
app.use((req, res) => {
  res.status(404).json({ message: `${req.method} ${req.originalUrl} adresi bulunamadı.` });
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});