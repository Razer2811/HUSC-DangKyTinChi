// Nhấn biểu tượng extension để bật/tắt bảng trợ lý trên trang HUSC.
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url || !tab.url.startsWith("https://student.husc.edu.vn/")) {
    return;
  }

  try {
    await chrome.tabs.sendMessage(tab.id, { type: "HUSC_HELPER_TOGGLE" });
  } catch (error) {
    // Content script chỉ được nạp trên student.husc.edu.vn.
    console.warn("Không thể gửi lệnh tới HUSC Helper:", error);
  }
});