import express, { Request, Response } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
  createTodoController,
  deleteTodoController,
  getTodosByDateController,
  getTodosController,
  upDateTodoController,
  updateTodoStatusController,
  moveToArchiveController,
  moveToRetryController,
} from '../controller/todo.controller';

const router = express.Router();

// 투두 등록
router.post('/', authenticate, createTodoController);
// 투두 조회 (date 쿼리 파라미터에 따라 분기)
router.get('/', authenticate, getTodosController);
// 투두 날짜별 조회 (기존 호환성을 위해 유지)
router.get('/by-date', authenticate, getTodosByDateController);

// 투두 수정
router.put('/:id', authenticate, upDateTodoController);
// 투두 삭제
router.delete('/:id', authenticate, deleteTodoController);

// 투두 상태 변경
router.put('/:id/status', authenticate, updateTodoStatusController);
// 보관함으로 이동
router.put('/:id/archive', authenticate, moveToArchiveController);
// 재시도로 이동
router.put('/:id/retry', authenticate, moveToRetryController);

export default router;
