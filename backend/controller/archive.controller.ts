import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  deleteArchivedTodo,
  getArchivedTodos,
  restoreArchivedTodo,
  updateArchivedTodo,
} from '../service/archive.service';
import {
  handleTodoResponse,
  handleSingleTodoResponse,
} from '../utils/responseHandler';

// 보관함 목록 조회
export const getArchivedTodosController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;

  return await handleSingleTodoResponse(
    res,
    () => getArchivedTodos(userId),
    '보관함에 있는 투두 목록을 가져왔습니다.',
    '보관함 목록 조회 중 오류가 발생했습니다'
  );
};

// 보관함 투두 수정
export const updateArchivedTodoController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;
  const todoId = Number(req.params.id);
  const data = req.body;

  return await handleTodoResponse(
    res,
    () => updateArchivedTodo(todoId, userId, data),
    '보관함 투두가 수정되었습니다.',
    '수정할 보관함 투두가 존재하지 않습니다.'
  );
};

// 보관함 투두 삭제
export const deleteArchivedTodoController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;
  const todoId = Number(req.params.id);

  return await handleTodoResponse(
    res,
    () => deleteArchivedTodo(todoId, userId),
    '보관함 투두가 삭제되었습니다.',
    '삭제할 보관함 투두가 존재하지 않습니다.'
  );
};

// 보관함 -> 오늘의 할일로 이동
export const restoreArchivedTodoController = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.id;
  const todoId = Number(req.params.id);

  return await handleSingleTodoResponse(
    res,
    () => restoreArchivedTodo(todoId, userId),
    '보관함에서 오늘의 할일로 복구했습니다.',
    '복구할 보관함 투두가 존재하지 않습니다.'
  );
};
