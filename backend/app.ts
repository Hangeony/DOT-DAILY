import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorNotFoundHandler, errorHandler } from './middlewares/errorHandler';
import { swaggerSpec } from './docs';
import swaggerUi from 'swagger-ui-express';
import routers from './router/index';
import { startBatchJobs } from './jobs/cron';

const app = express();
const port = 3001;

//기본 미들웨어
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 라우터
app.use('/api/v1', routers);

// 배포시 404 에러 방지
app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

// 서버 죽는거 방지
app.get('/healthz', (req, res) => {
  res.json({ message: 'ok' });
});

//서버 시작 시 배치 스케줄 등록
startBatchJobs();

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 핸들러
app.use(errorNotFoundHandler);
// 에러 핸들러
app.use(errorHandler);

app.listen(port, () => {
  console.log(`${port} 번으로 실행중`);
});
