// background.ts
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage()
})

// 可選：檢查是否已設置 API key，如果未設置，在圖標上顯示徽章
async function checkApiKey() {
  const apiKey = await storage.get("openaiApiKey")
  if (!apiKey) {
    chrome.action.setBadgeText({ text: "!" })
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" })
  } else {
    chrome.action.setBadgeText({ text: "" })
  }
}

// 在擴展啟動時檢查 API key
checkApiKey()

// 監聽存儲變化，更新徽章
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.openaiApiKey) {
    checkApiKey()
  }
})