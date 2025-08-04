import colors from "tailwindcss/colors";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./.storybook/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)", "sans-serif"],
        kkonghae: ["var(--font-kkonghae)", "cursive"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        bold: "700",
      },
      colors: {
        brand: {
          primary: colors.blue[500], // 로고 강조색
          secondary: colors.indigo[500], // 보조 강조 텍스트
        },
        priority: {
          must: colors.red[500], // 오늘 무조건
          should: colors.emerald[500], // 오늘이면 굿
          remind: colors.sky[500], // 잊지 말자
        },
        status: {
          doneBg: colors.indigo[100], // 완료 배경
          disabledText: colors.indigo[300], // 흐린 텍스트
          success: colors.green[500], // 성공 상태
        },
        tag: {
          retryBg: colors.indigo[100],
          retryStrong: colors.indigo[500],
          retryWeak: colors.indigo[300],
        },
        nav: {
          active: colors.zinc[600],
          inactive: colors.zinc[300],
        },
        surface: {
          base: "#f8fafc", // 전체 배경
          card: colors.white, // 카드 배경
          input: colors.gray[50], // 입력창 배경
          popup: colors.white, // 팝업용 배경
          hover: colors.gray[100], // 호버 배경
        },
        text: {
          default: colors.gray[800], // 일반 텍스트
          light: colors.gray[600], // 흐린 텍스트
          strong: colors.gray[900], // 강조 텍스트
          weak: colors.gray[500], // 약한 텍스트
        },
        border: {
          default: colors.gray[200], // 일반 테두리
          input: colors.gray[200], // 입력창 테두리
          popup: colors.gray[300], // 팝업 테두리
          card: {
            default: colors.gray[200], // 카드 기본 테두리
            strong: colors.gray[300], // 카드 강조 테두리
            weak: colors.gray[100], // 카드 약한 테두리
          },
        },
        shadow: {
          default: colors.gray[200], // 기본 그림자
          strong: colors.gray[300], // 강조 그림자
          weak: colors.gray[100], // 약한 그림자
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".pb-safe": {
          paddingBottom: "env(safe-area-inset-bottom)",
        },
        ".pt-safe": {
          paddingTop: "env(safe-area-inset-top)",
        },
        ".pl-safe": {
          paddingLeft: "env(safe-area-inset-left)",
        },
        ".pr-safe": {
          paddingRight: "env(safe-area-inset-right)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
