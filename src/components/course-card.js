(() => {
  const Utils = globalThis.HUSCHelperUtils;

  function renderCourseCard(course) {
    return `
      <article class="hh-course-card">
        <div class="hh-course-heading">
          <strong>${Utils.escapeHTML(course.code)}</strong>
          <span>${Utils.escapeHTML(course.quota || "Chưa rõ sĩ số")}</span>
        </div>

        <div class="hh-course-meta">
          <p><b>Học phần:</b> ${Utils.escapeHTML(course.subject || "—")}</p>
          <p><b>Giảng viên:</b> ${Utils.escapeHTML(course.lecturer || "—")}</p>
          <p><b>Lịch học:</b> ${Utils.escapeHTML(course.schedule || "—")}</p>
          <p><b>Phòng:</b> ${Utils.escapeHTML(course.room || "—")}</p>
        </div>

        <div class="hh-course-actions">
          <button
            data-action="details"
            data-code="${Utils.escapeHTML(course.code)}"
          >
            Chi tiết
          </button>

          <button
            class="primary"
            data-action="register"
            data-code="${Utils.escapeHTML(course.code)}"
          >
            Mở đăng ký
          </button>
        </div>
      </article>`;
  }

  globalThis.HUSCCourseCard = {
    render: renderCourseCard
  };
})();