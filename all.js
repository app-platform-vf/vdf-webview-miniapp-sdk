const { execSync, exec } = require('child_process');
const path = require('path');
const readline = require('readline');
const fs = require('fs');

const EVENTS_JSON_PATH = path.join(__dirname, 'packages/core/src/events.json');
const NPP_PATH = '"C:\\Program Files\\Notepad++\\notepad++.exe"';

function runCommand(command, cwd = __dirname, ignoreError = false) {
    console.log(`\n===========================================`);
    console.log(`🚀 Đang chạy: ${command}`);
    if (cwd !== __dirname) {
        console.log(`📁 Thư mục: ${cwd}`);
    }
    console.log(`===========================================`);
    try {
        execSync(command, { stdio: 'inherit', cwd });
    } catch (error) {
        if (ignoreError) {
            console.log(`⚠️  Lệnh kết thúc (có thể không có thay đổi nào để commit), tiếp tục chạy...`);
        } else {
            console.error(`\n❌ Lỗi khi chạy lệnh: ${command}`);
            process.exit(1);
        }
    }
}

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

function waitForFileChange(filePath) {
    return new Promise((resolve) => {
        const initialContent = fs.readFileSync(filePath, 'utf8');
        console.log(`\n📝 Đang mở Notepad++: ${filePath}`);

        // Cố gắng mở Notepad++ (thử lệnh trực tiếp hoặc đường dẫn tuyệt đối)
        const openCmd = `start "" notepad++ "${filePath}" || start "" ${NPP_PATH} "${filePath}"`;
        exec(openCmd, (err) => {
            if (err) {
                console.log("⚠️  Không thể tự động mở Notepad++, vui lòng mở file thủ công.");
            }
        });

        console.log("👀 Đang chờ bạn sửa file và nhấn Lưu (Ctrl+S)...");

        const watcher = fs.watch(filePath, (eventType) => {
            if (eventType === 'change') {
                const currentContent = fs.readFileSync(filePath, 'utf8');
                if (currentContent !== initialContent) {
                    console.log("✅ Đã phát hiện thay đổi! Bắt đầu thực thi...");
                    watcher.close();
                    resolve();
                }
            }
        });
    });
}

async function main() {
    // Bước 0: Chờ thay đổi file events.json
    // await waitForFileChange(EVENTS_JSON_PATH);

    console.log("\n⚡ BẮT ĐẦU CHU TRÌNH TỰ ĐỘNG ⚡");

    runCommand("npm run pack");
    runCommand("npm run demo");
    runCommand("npm run doc");

    const answer = await askQuestion("\n❓ Đã sinh xong document! Bạn có cho phép đẩy code lên git không? (Nhấn Enter để đồng ý, gõ 'n' để hủy): ");

    if (answer.trim().toLowerCase() === 'n') {
        console.log("\n🛑 Đã hủy quá trình push code lên git.\n");
        process.exit(0);
    }

    console.log("\n🚀 TIẾN HÀNH ĐẨY CODE LÊN GIT CHUYÊN SÂU...");

    // 1. Thư mục webview-sdk
    console.log("\n[1/2] COMMIT & PUSH: webview-sdk");
    runCommand("git add .");
    runCommand("git commit -m \"them event\"", __dirname, true);
    runCommand("git push origin cuongnm70");

    // 2. Thư mục developer-portal
    console.log("\n[2/2] COMMIT & PUSH: developer-portal");
    const portalDir = path.join(__dirname, '../developer-portal');
    runCommand("git add .", portalDir);
    runCommand("git commit -m \"them event doc\"", portalDir, true);
    runCommand("git push origin cuongnm70", portalDir);

    console.log("\n🎉 HOÀN THÀNH TOÀN BỘ CHU TRÌNH!\n");
}

main().catch(err => {
    console.error("❌ Lỗi hệ thống:", err);
    process.exit(1);
});
