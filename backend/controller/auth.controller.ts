import { Request, Response } from 'express';
import { loginService, logoutService } from '../service/auth.service';
import { loginSchema } from '../validations/authValidation';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { formatError } from '../utils/zodErrorFormatter';
import { googleTokenService } from '../service/googleAuth.service';

export const loginController = async (req: Request, res: Response) => {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await loginService(payload);

    if ('errors' in result) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(result);
      return;
    }

    res.status(StatusCodes.OK).json({
      message: '로그인에 성공했습니다.',
      data: result,
    });
    return;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: '로그인 데이터가 유효하지 않습니다.',
        errors,
      });
      return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '서버 에러가 발생했습니다.',
    });
    return;
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    // 혹시라도 다른 미들웨어에서 req.user를 덮어쓰거나,
    // 누락되는 실수가 생겼을 때,
    // 에러 대신 의미 있는 메시지를 줄 수 있음.
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: '로그인한 사용자만 로그아웃할 수 있습니다.',
      });
      return res.redirect('/');
    }
    const result = await logoutService(user.id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: '로그아웃 되었습니다.',
      data: result,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '서버 오류가 발생했습니다.',
    });
    return;
  }
};

export const googleLoginController = async (req: Request, res: Response) => {
  try {
    console.log('🚀 Google 로그인 컨트롤러 시작');
    const { accessToken } = req.body;

    console.log('📝 요청 데이터:', {
      hasAccessToken: !!accessToken,
      tokenLength: accessToken?.length,
    });

    if (!accessToken) {
      console.log('❌ accessToken이 없음');
      return res.status(400).json({
        success: false,
        message: 'Google access token이 필요합니다.',
      });
    }

    const result = await googleTokenService(accessToken);

    console.log('✅ Google 로그인 성공');
    res.json({
      success: true,
      accessToken: result.accessToken,
      user: result.user,
      message: 'Google 로그인 성공',
    });
  } catch (error) {
    console.error('❌ Google 로그인 컨트롤러 오류:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Google 로그인 실패';

    res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
};
