import { Request, Response } from 'express';
import { googleTokenService } from '../service/googleAuth.service';

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
