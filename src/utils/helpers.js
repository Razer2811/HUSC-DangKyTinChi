
(() => {
  const Helpers = {
    /**
     * Chuyển các ký tự HTML đặc biệt thành HTML entities.
     */
    escapeHTML(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]);
    },

    /**
     * Chuẩn hóa khoảng trắng trong chuỗi.
     */
    normalizeText(value) {
      return String(value ?? "").replace(/\s+/g, " ").trim();
    },

    /**
     * Kiểm tra định dạng mã học phần.
     * Ví dụ: TIN4313, LLCTKT2.
     */
    isValidCourseCode(value) {
      return /^[A-Za-z0-9.-]{3,60}$/.test(
        String(value ?? "").trim()
      );
    }
  };

  globalThis.HUSCHelperUtils = Helpers;
})();
