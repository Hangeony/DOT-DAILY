import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  console.log('🔍 인증 미들웨어 호출:', {
    hasAuthHeader: !!authHeader,
    authHeader: authHeader?.substring(0, 20) + '...',
    jwtSecret: process.env.JWT_SECRET ? '설정됨' : '설정되지 않음',
  });

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ 인증 헤더 없음 또는 Bearer 형식 아님');
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: '인증 정보가 없습니다.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log('✅ JWT 토큰 검증 성공:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('❌ JWT 토큰 검증 실패:', err);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: '유효하지 않은 토큰입니다.' });
    return;
  }
};
