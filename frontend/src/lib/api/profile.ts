import { httpClient } from "@/lib/api/http";

export const getUserProfileStats = async (
  period?: "all" | "month" | "week"
) => {
  try {
    const params = period && period !== "all" ? `?period=${period}` : "";
    const response = await httpClient.get(`user/stats${params}`);
    return response.data.data;
  } catch (error: unknown) {
    // 게스트 모드 오류는 조용하게 처리
    if (error instanceof Error && error.message.includes("Guest mode")) {
      throw error; // 게스트 모드 오류는 그대로 전파
    }

    console.error("❌ 사용자 통계 조회 실패:", error);

    // 500 에러 시 기본 통계 데이터 반환
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "status" in error.response &&
      error.response.status === 500
    ) {
      console.log("🔄 500 에러 감지 - 기본 통계 데이터 반환");

      // localStorage에서 실제 사용자 정보 가져오기
      let actualUser = {
        username: "사용자",
        email: "알 수 없음",
      };

      try {
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          if (authData.state?.user) {
            actualUser = {
              username:
                authData.state.user.username ||
                authData.state.user.name ||
                "사용자",
              email: authData.state.user.email || "알 수 없음",
            };
            console.log("✅ 실제 사용자 정보 사용:", actualUser);
          }
        }
      } catch (e) {
        console.warn("사용자 정보 파싱 실패:", e);
      }

      return {
        user: actualUser,
        todos: {
          pending: 0,
          retry: 0,
          success: 0,
          archive: 0,
        },
        totalRetryCount: 0,
        stickers: [
          { stickerId: 1, label: "좋음", emoji: "😊", count: 0 },
          { stickerId: 2, label: "보통", emoji: "😐", count: 0 },
          { stickerId: 3, label: "나쁨", emoji: "😞", count: 0 },
          { stickerId: 4, label: "감사함", emoji: "🙏", count: 0 },
          { stickerId: 5, label: "자랑스러움", emoji: "😎", count: 0 },
        ],
      };
    }

    throw new Error("사용자 통계를 불러오는데 실패했습니다.");
  }
};
