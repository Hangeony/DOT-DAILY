import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';

export const googleTokenService = async (accessToken: string) => {
  try {
    console.log('📱 Google OAuth 요청 받음:', {
      accessToken: accessToken?.substring(0, 20) + '...',
    });

    // Google API로 사용자 정보 조회
    const googleUserResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );

    console.log('🔍 Google API 응답 상태:', googleUserResponse.status);

    if (!googleUserResponse.ok) {
      const errorText = await googleUserResponse.text();
      console.error('❌ Google API 응답 오류:', errorText);
      throw new Error(`Google API 오류: ${googleUserResponse.status}`);
    }

    const googleUser = await googleUserResponse.json();
    console.log('✅ Google 사용자 정보:', googleUser);

    if (!googleUser.email) {
      throw new Error('Google 사용자 이메일을 가져올 수 없습니다.');
    }

    // 기존 사용자 확인 또는 새 사용자 생성
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      console.log('🆕 새 Google 사용자 생성:', googleUser.email);
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          username: googleUser.name || googleUser.given_name,
          image: googleUser.picture,
        },
      });
      console.log('✅ 새 사용자 생성 완료:', user.id);
    } else {
      console.log('✅ 기존 사용자 발견:', user.id);
    }

    // Google 계정 정보 저장/업데이트
    const accountData = {
      userId: user.id,
      type: 'oauth',
      provider: 'google',
      providerAccountId: googleUser.id,
      access_token: accessToken,
    };

    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: googleUser.id,
        },
      },
      update: accountData,
      create: accountData,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    console.log('✅ JWT 토큰 생성 완료:', {
      userId: user.id,
      userEmail: user.email,
      tokenLength: token.length,
      jwtSecret: process.env.JWT_SECRET ? '설정됨' : '설정되지 않음',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        image: user.image,
      },
      accessToken: token,
    };
  } catch (error) {
    console.error('❌ Google OAuth 서비스 오류:', error);
    throw error;
  }
};
