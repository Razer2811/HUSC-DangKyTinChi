(() => {
  const Helpers = {
    escapeHTML(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]);
    },

    normalizeText(value) {
      return String(value ?? "").replace(/\s+/g, " ").trim();
    },

    isValidCourseCode(value) {
      // Ví dụ: TIN4313, LLCTKT2
      return /^[A-Za-z0-9.-]{3,60}$/.test(String(value ?? "").trim());
    }
  };

  globalThis.HUSCHelperUtils = Helpers;
})();