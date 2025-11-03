// fix-ui-imports.js
import fs from "fs";
import path from "path";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

// ui / components / src 등 하위 폴더 전체 탐색
function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath);
        } else if (extensions.some(ext => fullPath.endsWith(ext))) {
            let code = fs.readFileSync(fullPath, "utf-8");

            // @버전 import 제거
            let updated = code
                .replace(/@radix-ui\/react-([a-z-]+)@[0-9.]+/g, "@radix-ui/react-$1")
                .replace(/lucide-react@[0-9.]+/g, "lucide-react")
                .replace(/sonner@[0-9.]+/g, "sonner");

            if (code !== updated) {
                fs.writeFileSync(fullPath, updated, "utf-8");
                console.log("✅ Fixed:", fullPath);
            }
        }
    }
}

const projectRoot = path.resolve(".");
walk(projectRoot);

console.log("🎉 모든 잘못된 import 경로 수정 완료!");
