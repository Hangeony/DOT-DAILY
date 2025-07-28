const { optimize } = require("svgo");
const fs = require("fs");
const path = require("path");

// SVG 최적화 설정
const svgoConfig = {
  plugins: [
    "preset-default",
    {
      name: "removeViewBox",
      active: false,
    },
    {
      name: "removeDimensions",
      active: true,
    },
    {
      name: "removeXMLNS",
      active: false,
    },
  ],
};

async function optimizeSVGs() {
  const publicDir = path.join(__dirname, "../public");
  const files = fs.readdirSync(publicDir);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  console.log("🎯 SVG 최적화 시작...\n");

  for (const file of files) {
    if (path.extname(file) === ".svg") {
      const filePath = path.join(publicDir, file);
      const originalData = fs.readFileSync(filePath, "utf8");
      const originalSize = Buffer.byteLength(originalData, "utf8");

      try {
        const result = optimize(originalData, {
          ...svgoConfig,
          path: filePath,
        });

        const optimizedSize = Buffer.byteLength(result.data, "utf8");
        const reduction = (
          ((originalSize - optimizedSize) / originalSize) *
          100
        ).toFixed(1);

        // 최적화된 내용으로 파일 덮어쓰기
        fs.writeFileSync(filePath, result.data);

        totalOriginalSize += originalSize;
        totalOptimizedSize += optimizedSize;

        console.log(
          `✅ ${file}: ${originalSize}B → ${optimizedSize}B (-${reduction}%)`
        );
      } catch (error) {
        console.error(`❌ ${file} 최적화 실패:`, error.message);
      }
    }
  }

  const totalReduction = (
    ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) *
    100
  ).toFixed(1);

  console.log("\n📊 최적화 완료!");
  console.log(`총 크기: ${totalOriginalSize}B → ${totalOptimizedSize}B`);
  console.log(
    `총 절약: ${totalReduction}% (${totalOriginalSize - totalOptimizedSize}B)`
  );
}

optimizeSVGs().catch(console.error);
