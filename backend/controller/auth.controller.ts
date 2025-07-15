import { Request, Response } from 'express';
import { loginService, logoutService } from '../service/auth.service';
import { loginSchema } from '../validations/authValidation';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { formatError } from '../utils/zodErrorFormatter';
import {
  googleTokenService,
  googleCallbackService,
} from '../service/googleAuth.service';

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
    return res.redirect('/');
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

//  Google 로그인 (idToken 받아서 처리)
export const googleLoginController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ message: 'idToken이 필요합니다.' });
      return;
    }

    const { user, token } = await googleTokenService(idToken);

    res.status(200).json({
      message: 'Google 로그인 성공',
      user,
      accessToken: `Bearer ${token}`,
    });
    return;
  } catch (error) {
    console.error('[Google Login Error]', error);
    res.status(401).json({ message: 'Google 로그인 실패' });
    return;
  }
};

//  Google Callback (로그인 후 콜백 처리)
export const googleCallbackController = async (req: Request, res: Response) => {
  try {
    const { user } = req.body; // 콜백 시 전달받은 user 정보

    if (!user) {
      res.status(400).json({ message: '사용자 정보가 필요합니다.' });
      return;
    }

    const token = await googleCallbackService(user);

    res.status(200).json({
      message: 'Google 콜백 처리 완료',
      accessToken: `Bearer ${token}`,
    });
    return;
  } catch (error) {
    console.error('[Google Callback Error]', error);
    res.status(500).json({ message: 'Google 콜백 처리 실패' });
    return;
  }
};
