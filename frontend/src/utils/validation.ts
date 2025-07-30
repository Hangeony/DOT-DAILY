// 검증 패턴 상수
export const VALIDATION_PATTERNS = {
  // 더 정확한 이메일 패턴 (RFC 5322 표준 기반)
  EMAIL:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,
} as const;

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  REQUIRED: {
    EMAIL: "이메일을 입력해주세요.",
    PASSWORD: "비밀번호를 입력해주세요.",
    NAME: "이름을 입력해주세요.",
    CONFIRM_PASSWORD: "비밀번호 확인을 입력해주세요.",
  },
  FORMAT: {
    EMAIL: "올바른 이메일 형식이 아닙니다.",
    PASSWORD_LENGTH: `비밀번호는 ${VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH}자 이상 ${VALIDATION_PATTERNS.PASSWORD_MAX_LENGTH}자 이하여야 합니다.`,
    PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
    NAME_LENGTH: `이름은 ${VALIDATION_PATTERNS.NAME_MIN_LENGTH}자 이상 ${VALIDATION_PATTERNS.NAME_MAX_LENGTH}자 이하여야 합니다.`,
  },
} as const;

// 검증 결과 타입
export type ValidationResult = string | undefined;

/**
 * 이름 검증
 * @param name 검증할 이름
 * @returns 에러 메시지 또는 undefined (성공 시)
 */
export const validateName = (name: string): ValidationResult => {
  // 입력값 유효성 검사
  if (typeof name !== "string") {
    return "이름은 문자열이어야 합니다.";
  }

  const trimmedName = name.trim();

  // 필수 입력 검사
  if (!trimmedName) {
    return ERROR_MESSAGES.REQUIRED.NAME;
  }

  // 길이 검사
  if (trimmedName.length < VALIDATION_PATTERNS.NAME_MIN_LENGTH) {
    return ERROR_MESSAGES.FORMAT.NAME_LENGTH;
  }

  if (trimmedName.length > VALIDATION_PATTERNS.NAME_MAX_LENGTH) {
    return ERROR_MESSAGES.FORMAT.NAME_LENGTH;
  }

  return undefined;
};

/**
 * 이메일 검증
 * @param email 검증할 이메일
 * @returns 에러 메시지 또는 undefined (성공 시)
 */
export const validateEmail = (email: string): ValidationResult => {
  // 입력값 유효성 검사
  if (typeof email !== "string") {
    return "이메일은 문자열이어야 합니다.";
  }

  const trimmedEmail = email.trim();

  // 필수 입력 검사
  if (!trimmedEmail) {
    return ERROR_MESSAGES.REQUIRED.EMAIL;
  }

  // 이메일 형식 검사
  if (!VALIDATION_PATTERNS.EMAIL.test(trimmedEmail)) {
    return ERROR_MESSAGES.FORMAT.EMAIL;
  }

  return undefined;
};

/**
 * 비밀번호 검증
 * @param password 검증할 비밀번호
 * @returns 에러 메시지 또는 undefined (성공 시)
 */
export const validatePassword = (password: string): ValidationResult => {
  // 입력값 유효성 검사
  if (typeof password !== "string") {
    return "비밀번호는 문자열이어야 합니다.";
  }

  const trimmedPassword = password.trim();

  // 필수 입력 검사
  if (!trimmedPassword) {
    return ERROR_MESSAGES.REQUIRED.PASSWORD;
  }

  // 길이 검사
  if (trimmedPassword.length < VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.FORMAT.PASSWORD_LENGTH;
  }

  if (trimmedPassword.length > VALIDATION_PATTERNS.PASSWORD_MAX_LENGTH) {
    return ERROR_MESSAGES.FORMAT.PASSWORD_LENGTH;
  }

  return undefined;
};

/**
 * 비밀번호 확인 검증
 * @param password 원본 비밀번호
 * @param confirmPassword 확인 비밀번호
 * @returns 에러 메시지 또는 undefined (성공 시)
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  // 입력값 유효성 검사
  if (typeof password !== "string" || typeof confirmPassword !== "string") {
    return "비밀번호는 문자열이어야 합니다.";
  }

  const trimmedConfirmPassword = confirmPassword.trim();

  // 필수 입력 검사
  if (!trimmedConfirmPassword) {
    return ERROR_MESSAGES.REQUIRED.CONFIRM_PASSWORD;
  }

  // 비밀번호 일치 검사
  if (password !== trimmedConfirmPassword) {
    return ERROR_MESSAGES.FORMAT.PASSWORD_MISMATCH;
  }

  return undefined;
};

/**
 * 모든 필드 검증
 * @param fields 검증할 필드들
 * @returns 검증 결과 객체
 */
export const validateForm = (fields: {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}) => {
  const errors: Record<string, string> = {};

  if (fields.name !== undefined) {
    const nameError = validateName(fields.name);
    if (nameError) errors.name = nameError;
  }

  if (fields.email !== undefined) {
    const emailError = validateEmail(fields.email);
    if (emailError) errors.email = emailError;
  }

  if (fields.password !== undefined) {
    const passwordError = validatePassword(fields.password);
    if (passwordError) errors.password = passwordError;
  }

  if (fields.confirmPassword !== undefined && fields.password !== undefined) {
    const confirmPasswordError = validateConfirmPassword(
      fields.password,
      fields.confirmPassword
    );
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
