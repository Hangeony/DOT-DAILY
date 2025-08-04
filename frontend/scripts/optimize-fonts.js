const fs = require("fs");
const path = require("path");

// 폰트 파일 경로
const fontPaths = {
  kkonghae: "src/app/fonts/kkonghae.woff2",
  pretendard: "src/app/fonts/Pretendard/PretendardVariable.woff2",
};

// 폰트 파일 크기 확인
function checkFontSizes() {
  console.log("📊 폰트 파일 크기 분석:");

  Object.entries(fontPaths).forEach(([name, filePath]) => {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeInKB = (stats.size / 1024).toFixed(2);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

      console.log(`  ${name}: ${sizeInKB} KB (${sizeInMB} MB)`);

      if (stats.size > 500 * 1024) {
        // 500KB 이상
        console.log(`  ⚠️  ${name} 폰트가 너무 큽니다! 최적화가 필요합니다.`);
      }
    } else {
      console.log(`  ❌ ${name}: 파일을 찾을 수 없습니다.`);
    }
  });
}

// 폰트 최적화 권장사항
function getOptimizationRecommendations() {
  console.log("\n🎯 폰트 최적화 권장사항:");
  console.log("1. 폰트 서브셋 생성 (한글만 포함)");
  console.log("2. WOFF2 압축 최적화");
  console.log("3. 폰트 로딩 전략 개선");
  console.log("4. 폰트 파일 분할 (필수/선택)");
}

// 실행
checkFontSizes();
getOptimizationRecommendations();
