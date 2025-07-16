export const VALIDATION_PATTERNS = {
  EMAIL: /\S+@\S+\.\S+/,
  PASSWORD_MIN_LENGTH: 8
};

export const ERROR_MESSAGES = {
  REQUIRED: {
    EMAIL: '이메일이 입력되지 않았습니다.',
    PASSWORD: '비밀번호가 입력되지 않았습니다.',
    NAME: '이름이 입력되지 않았습니다.',
    CONFIRM_PASSWORD: '비밀번호가 입력되지 않았습니다.'
  },
  FORMAT: {
    EMAIL: '올바른 이메일 형식이 아닙니다.',
    PASSWORD_LENGTH: '비밀번호는 8자 이상이어야 합니다.',
    PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.'
  }
};

export const validateName = (name: string): string | undefined => {
  if (!name.trim()) return ERROR_MESSAGES.REQUIRED.NAME;
  return undefined;
};

export const validateEmail = (email: string) => {
  if (!email.trim()) return ERROR_MESSAGES.REQUIRED.EMAIL;
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) return ERROR_MESSAGES.FORMAT.EMAIL;
  return undefined;
};

export const validatePassword = (password: string) => {
  if (!password.trim()) return ERROR_MESSAGES.REQUIRED.PASSWORD;
  if (password.length < VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.FORMAT.PASSWORD_LENGTH;
  }
  return undefined;
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword.trim()) return ERROR_MESSAGES.REQUIRED.CONFIRM_PASSWORD;
  if (password !== confirmPassword) return ERROR_MESSAGES.FORMAT.PASSWORD_MISMATCH;
  return undefined;
}; 