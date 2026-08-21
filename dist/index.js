import 'dotenv/config';
import express from 'express';
const app = express();
const DEFAULT_PORT = 3000;
const port = Number(process.env.PORT) || DEFAULT_PORT;
app.use(express.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map