import { prisma } from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginPayload {
  email: string;
  password: string;
}

export const loginService = async (payload: LoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    return { message: '해당 이메일로 가입된 사용자가 없습니다.' };
  }

  const isMatch = await bcrypt.compare(
    payload.password,
    user.password_hash ?? ''
  );

  if (!isMatch) {
    return {
      errors: {
        email: '이메일 또는 비밀번호가 올바르지 않습니다.',
      },
    };
  }

  const JWTPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const accessToken = jwt.sign(JWTPayload, process.env.JWT_SECRET!, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(JWTPayload, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });

  const existingAccount = await prisma.account.findFirst({
    where: {
      userId: user.id,
      provider: 'local',
    },
  });

  if (existingAccount) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: {
        type: 'credentials',
        provider: 'local',
        providerAccountId: user.email ?? '',
        refresh_token: refreshToken,
      },
    });
  } else {
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'credentials',
        provider: 'local',
        providerAccountId: user.email ?? '',
        refresh_token: refreshToken,
      },
    });
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const logoutService = async (userId: number) => {
  await prisma.account.deleteMany({
    where: {
      userId,
      provider: 'local',
    },
  });
  return;
};
