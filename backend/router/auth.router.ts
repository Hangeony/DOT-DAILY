import express, { Request, Response, NextFunction } from 'express';
import { registerController } from '../controller/register.controller';
import { googleTokenService } from '../service/googleAuth.service';

const router = express.Router();

// 회원가입
router.post('/signup', registerController);

// 일반 로그인 (임시)
router.post('/login', (req: Request, res: Response): void => {
  res.json({ message: '일반 로그인 구현 예정' });
});

// 로그아웃 (임시)
router.post('/logout', (req: Request, res: Response): void => {
  res.json({ message: '로그아웃 성공' });
});

// Google 로그인
router.post(
  '/google/login',
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('🚀 Google 로그인 시작');
      const { accessToken } = req.body;

      if (!accessToken) {
        res.status(400).json({
          success: false,
          message: 'Google access token이 필요합니다.',
        });
        return;
      }

      const result = await googleTokenService(accessToken);

      res.json({
        success: true,
        accessToken: result.accessToken,
        user: result.user,
        message: 'Google 로그인 성공',
      });
    } catch (error) {
      console.error('❌ Google 로그인 오류:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Google 로그인 실패',
      });
    }
  }
);

// Google 콜백 (임시)
router.post('/google/callback', (req: Request, res: Response): void => {
  res.json({ message: 'Google 콜백 구현 예정' });
});

export default router;
