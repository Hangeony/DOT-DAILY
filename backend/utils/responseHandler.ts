import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// 성공 응답 처리
export const sendSuccessResponse = (
  res: Response,
  data: any,
  message: string,
  statusCode: number = StatusCodes.OK
) => {
  res.status(statusCode).json({
    message,
    data,
  });
};

// 에러 응답 처리
export const sendErrorResponse = (
  res: Response,
  message: string,
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
) => {
  res.status(statusCode).json({
    message,
  });
};

// 투두 관련 공통 응답 처리
export const handleTodoResponse = async (
  res: Response,
  serviceFunction: () => Promise<any>,
  successMessage: string,
  notFoundMessage: string = '데이터가 존재하지 않습니다.'
) => {
  try {
    const result = await serviceFunction();
    
    if (result.count === 0) {
      return sendErrorResponse(res, notFoundMessage, StatusCodes.NOT_FOUND);
    }
    
    return sendSuccessResponse(res, result, successMessage);
  } catch (err: any) {
    console.error('❌ 서비스 실행 중 오류:', err);
    return sendErrorResponse(res, '오류가 발생했습니다.');
  }
};

// 단일 데이터 응답 처리 (count가 아닌 데이터 자체를 반환하는 경우)
export const handleSingleTodoResponse = async (
  res: Response,
  serviceFunction: () => Promise<any>,
  successMessage: string,
  notFoundMessage: string = '데이터가 존재하지 않습니다.'
) => {
  try {
    const result = await serviceFunction();
    
    if (!result) {
      return sendErrorResponse(res, notFoundMessage, StatusCodes.NOT_FOUND);
    }
    
    return sendSuccessResponse(res, result, successMessage);
  } catch (err: any) {
    console.error('❌ 서비스 실행 중 오류:', err);
    return sendErrorResponse(res, '오류가 발생했습니다.');
  }
}; 