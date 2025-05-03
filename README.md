
# Celestial Key 前端範例包

本專案示範如何在 **純前端 + CDN** 架構下，查詢每日命理解說。

* **資料位置**：`daily/latest/flowday_{1‑9}_lifepath_{1‑9|11|22|33}.json`
* **示範資料**：只提供 *flowday 1* 的 12 個生命路徑數檔案，作為 PoC。
* **查詢流程**：
  1. 使用者輸入生日
  2. `script.js` 計算
     * LifePath (含 11/22/33)
     * Zodiac (中文去「座」字)
     * 今日 FlowDay
  3. 組出檔名，向 `daily/latest/` 抓對應檔案
  4. 讀取陣列後，以 `sign` 開頭比對星座 ➜ 顯示 `message`

## 上線建議

1. n8n 每日 00:05 產出 108 檔 ➜ 上傳 /daily/2025‑05‑04/
2. 完成後，用 CI/CD 或指令 `rsync` 同步到 /daily/latest/ 以便前端永遠指向最新
3. Cloudflare Pages / S3 靜態托管，記得打開 `Cache-Control: public, max-age=86400, immutable`
4. 如需分環境，改用 `ENV` 變數寫入 `index.html` 的 `<script>` 區段

— Generated on 2025-05-03 by ChatGPT
