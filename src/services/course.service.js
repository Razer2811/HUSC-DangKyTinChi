
(() => {
  const Utils = globalThis.HUSCHelperUtils;

  class CourseService {
    async searchClasses(courseCode) {
      const code = String(courseCode ?? "").trim();

      if (!Utils.isValidCourseCode(code)) {
        throw new Error("Mã học phần không hợp lệ. Vui lòng kiểm tra lại.");
      }

      const url = new URL(
        `/Studying/Courses/${encodeURIComponent(code)}/`,
        window.location.origin
      );

      const response = await fetch(url.href, {
        method: "GET",
        credentials: "include",
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      });

      if (!response.ok) {
        throw new Error(`HUSC trả về HTTP ${response.status}.`);
      }

      const html = await response.text();
      return this.parseClasses(html);
    }

    parseClasses(html) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const rows = [...doc.querySelectorAll("table.table-striped tbody tr")];

      return rows.map((row) => {
        const cells = [...row.querySelectorAll("td")];
        const small = row.querySelector("small");

        const classCode = Utils.normalizeText(
          small?.textContent ||
          row.querySelector("a[href*='/Course/Details/']")?.textContent
        );

        if (!classCode || cells.length === 0) {
          return null;
        }

        const values = cells.map((cell) =>
          Utils.normalizeText(cell.textContent)
        );

        const detailLink = row.querySelector(
          "a[href*='/Course/Details/']"
        );

        return {
          code: classCode,
          subject: values[0] || "",
          lecturer: values[1] || "",
          schedule: values[2] || "",
          room: values[3] || "",
          note: values[4] || "",
          quota: values[5] || "",

          detailUrl: detailLink
            ? new URL(
                detailLink.getAttribute("href"),
                window.location.origin
              ).href
            : new URL(
                `/Course/Details/${encodeURIComponent(classCode)}/`,
                window.location.origin
              ).href
        };
      }).filter(Boolean);
    }

    async getClassDetails(classCode) {
      const url = new URL(
        `/Course/Details/${encodeURIComponent(classCode)}/`,
        window.location.origin
      );

      const response = await fetch(url.href, {
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(
          `Không tải được chi tiết lớp (HTTP ${response.status}).`
        );
      }

      const doc = new DOMParser().parseFromString(
        await response.text(),
        "text/html"
      );

      const result = {};

      doc.querySelectorAll("label.control-label").forEach((label) => {
        const key = Utils.normalizeText(label.textContent)
          .replace(/[:：]$/, "");

        const valueNode = label.parentElement?.querySelector(
          "input, textarea, select, .form-control, p, span"
        );

        const value = Utils.normalizeText(
          valueNode?.value ??
          valueNode?.textContent ??
          label.parentElement?.textContent
        );

        if (key && value) {
          result[key] = value;
        }
      });

      return result;
    }
  }

  globalThis.HUSCCourseService = new CourseService();
})();
