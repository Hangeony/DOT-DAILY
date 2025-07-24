import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  createTodoService,
  deleteTodoService,
  getAllTodosService,
  getTodosByDateService,
  updateTodoService,
  updateTodoStatusService,
  moveToArchiveService,
  moveToRetryService,
  moveToTodayService,
  getArchivedTodosService,
  updateArchivedTodoService,
  deleteArchivedTodoService,
  restoreArchivedTodoService,
} from '../service/todo.service';
import { insertTodoSchema } from '../validations/todoValidation';
import { ZodError } from 'zod';

//투두 등록
export const createTodoController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const parsed = insertTodoSchema.parse(req.body);

    const { title, date } = parsed;
    const { status, priority } = req.body;

    const todo = await createTodoService({
      userId,
      title,
      date,
      status,
      priority,
    });

    res.status(StatusCodes.CREATED).json({
      message: '투두가 생성 되었습니다.',
      data: todo,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: err.flatten().fieldErrors });
      return;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '투두 생성 중 오류가 발생했습니다',
    });
  }
};

// 투두 전체 조회
export const getAllTodosController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const todos = await getAllTodosService(userId);

    res.status(StatusCodes.OK).json({
      message: '전체 투두 목록 조회 성공',
      data: todos,
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '전체 투두 목록 조회 중 오류 발생' });
  }
};

// 투두 조회 (date 쿼리 파라미터에 따라 분기)
export const getTodosController = async (req: Request, res: Response) => {
  const { date } = req.query;
  if (date) {
    return getTodosByDateController(req, res);
  }
  return getAllTodosController(req, res);
};

//투두 날짜별 조회
export const getTodosByDateController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { date } = req.query as { date: string };

    console.log('🔍 getTodosByDateController 호출:', { userId, date });

    if (!date) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: '날짜(date)를 query로 전달해주세요 (예: ?date=2025-07-04)',
      });
      return;
    }

    const todos = await getTodosByDateService(userId, date);
    res.status(StatusCodes.OK).json({
      message: `${date}의 투두 목록 조회 성공`,
      data: todos,
    });
  } catch (err) {
    console.error('❌ getTodosByDateController 오류:', err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '날짜별 투두 목록 조회 중 오류 발생' });
  }
};

//투두 수정
export const upDateTodoController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const todoId = Number(req.params.id);
    const data = req.body;

    const updated = await updateTodoService(todoId, userId, data);

    if (updated.count === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '수정할 투두가 존재 하지 않습니다.',
      });
      return;
    }
    res.status(StatusCodes.OK).json({
      message: '투두가 수정되었습니다.',
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '투두 수정 중 오류 발생' });
  }
};

//투두 삭제
export const deleteTodoController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const todoId = Number(req.params.id);

    const deleted = await deleteTodoService(todoId, userId);

    if (deleted.count === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '삭제할 투두가 존재하지 않습니다.',
      });
      return;
    }
    res.status(StatusCodes.OK).json({
      message: '투두가 삭제되었습니다.',
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '투두 삭제 중 오류 발생' });
  }
};

// 투두 상태 변경
export const updateTodoStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const todoId = Number(req.params.id);
    const { status } = req.body;

    const updated = await updateTodoStatusService(todoId, userId, status);

    if (updated.count === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '상태를 변경할 투두가 존재하지 않습니다.',
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: '투두 상태가 변경되었습니다.',
      data: { id: todoId, status },
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '투두 상태 변경 중 오류 발생' });
  }
};

// 보관함으로 이동
export const moveToArchiveController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const todoId = Number(req.params.id);

    const updated = await moveToArchiveService(todoId, userId);

    if (updated.count === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '보관함으로 이동할 투두가 존재하지 않습니다.',
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: '투두가 보관함으로 이동되었습니다.',
      data: { id: todoId, status: 'archive' },
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '보관함으로 이동 중 오류 발생' });
  }
};

// 재시도로 이동
export const moveToRetryController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const todoId = Number(req.params.id);

    const updated = await moveToRetryService(todoId, userId);

    if (updated.count === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '재시도로 이동할 투두가 존재하지 않습니다.',
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: '투두가 재시도로 이동되었습니다.',
      data: { id: todoId, status: 'retry' },
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '재시도로 이동 중 오류 발생' });
  }
};

// 오늘로 이동
export const moveToTodayController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const todoId = Number(req.params.id);

    const updated = await moveToTodayService(todoId, userId);

    if (updated.count === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '오늘로 이동할 투두가 존재하지 않습니다.',
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: '투두가 오늘로 이동되었습니다.',
      data: { id: todoId, status: 'pending' },
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '오늘로 이동 중 오류 발생' });
  }
};

// 보관함 투두 목록 조회
export const getArchivedTodosController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const todos = await getArchivedTodosService(userId);

    res.status(StatusCodes.OK).json({
      message: '보관함 투두 목록 조회 성공',
      data: todos,
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '보관함 투두 목록 조회 중 오류 발생' });
  }
};

// 보관함 투두 수정
export const updateArchivedTodoController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const todoId = Number(req.params.id);
    const { title, date, priority } = req.body;

    const updated = await updateArchivedTodoService(todoId, userId, {
      title,
      date,
      priority,
    });

    if (updated.count === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '수정할 보관함 투두가 존재하지 않습니다.',
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: '보관함 투두가 수정되었습니다.',
      data: { id: todoId, title, date, priority },
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '보관함 투두 수정 중 오류 발생' });
  }
};

// 보관함 투두 삭제
export const deleteArchivedTodoController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const todoId = Number(req.params.id);

    const deleted = await deleteArchivedTodoService(todoId, userId);

    if (deleted.count === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: '삭제할 보관함 투두가 존재하지 않습니다.',
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: '보관함 투두가 삭제되었습니다.',
      data: { id: todoId },
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '보관함 투두 삭제 중 오류 발생' });
  }
};

// 보관함 투두 복구 (오늘로 이동)
export const restoreArchivedTodoController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const todoId = Number(req.params.id);

    const restored = await restoreArchivedTodoService(todoId, userId);

    res.status(StatusCodes.OK).json({
      message: '보관함 투두가 오늘로 복구되었습니다.',
      data: restored,
    });
  } catch (err: any) {
    if (err.message.includes('존재하지 않거나 접근 권한이 없습니다')) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: err.message,
      });
      return;
    }
    if (err.message.includes('보관함에 있는 투두만 복구할 수 있습니다')) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message,
      });
      return;
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '보관함 투두 복구 중 오류 발생' });
  }
};
