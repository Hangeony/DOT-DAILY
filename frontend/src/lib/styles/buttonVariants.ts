import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  // 공통 스타일: 정렬, 폰트, 상태 등
  'inline-flex items-center justify-center font-semibold transition whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      /**
       * ✅ 버튼 유형 (색상/스타일)
       */
      variant: {
        /** 메인 강조 버튼 (ex: "오늘 회고 작성하기") */
        primary: 'bg-brand-primary text-white hover:bg-brand-primary/90',

        /** 서브 버튼 (ex: "선택한 날짜로 이동") */
        secondary:
          'bg-white text-brand-primary border border-brand-primary hover:bg-brand-primary/10',

        /** 삭제 등 위험한 액션 버튼 */
        danger: 'bg-priority-must text-white hover:bg-priority-must/90',

        /** 테두리 버튼 (중립 액션, 기본 텍스트 색상 사용) */
        outline:
          'bg-white text-text-strong border border-text-strong hover:bg-text-strong/5',

        /** 배경 없는 텍스트 버튼 */
        ghost: 'bg-transparent text-brand-primary hover:bg-brand-primary/10',

        /** 별도 스타일 없는 기본 버튼 (fallback) */
        solid: 'bg-brand-primary text-white hover:bg-brand-primary/90',
      },

      /**
       * ✅ 버튼 크기 (피그마 기준)
       */
      size: {
        sm: 'h-9 px-3 text-sm', // 작은 버튼 (ex: 태그, 팝업 내부)
        md: 'h-[48px] px-4 text-base', // 기본 버튼 (모바일 주력)
        lg: 'h-12 px-6 text-lg', // 큰 버튼 (거의 사용 안함)
      },

      /**
       * ✅ 둥글기 정도 (디자인 가이드 기반)
       */
      rounded: {
        none: '',
        md: 'rounded-md',
        full: 'rounded-full', // 피그마에서 주로 사용하는 스타일
      },

      /**
       * ✅ 전체 너비 여부 (페이지 하단 버튼에 주로 사용)
       */
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },

    /**
     * ✅ 기본값 설정 (지정하지 않아도 적용됨)
     */
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'full',
      fullWidth: false,
    },
  }
);
