(() => {
  if (window.__HUSC_HELPER_LOADED__) return;
  window.__HUSC_HELPER_LOADED__ = true;

  const Utils = globalThis.HUSCHelperUtils;
  const CourseService = globalThis.HUSCCourseService;
  const Card = globalThis.HUSCCourseCard;

  const state = {
    visible: false,
    activeTabId: 1,
    nextTabId: 2,
    tabs: [{ id: 1, title: "Tra cứu 1", code: "", view: "search", iframe: null }]
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const getActiveTab = () => state.tabs.find((tab) => tab.id === state.activeTabId);

  function ensurePanel() {
    let panel = $("#husc-helper-panel");
    if (panel) return panel;

    panel = document.createElement("section");
    panel.id = "husc-helper-panel";
    panel.innerHTML = `
      <header class="hh-header">
        <div>
          <div class="hh-brand">HUSC Helper</div>
          <div class="hh-subtitle">Credit Registration Assistant</div>
        </div>
        <div class="hh-header-actions">
          <button id="hh-add-tab" title="Thêm tab">+</button>
          <button id="hh-minimize" title="Thu nhỏ">—</button>
          <button id="hh-close" title="Đóng">×</button>
        </div>
      </header>
      <nav id="hh-tabs" class="hh-tabs"></nav>
      <main id="hh-main"></main>
      <footer class="hh-footer">Công cụ hỗ trợ tra cứu. Mọi thao tác đăng ký và CAPTCHA do bạn tự thực hiện.</footer>
    `;
    document.documentElement.appendChild(panel);

    $("#hh-add-tab", panel).addEventListener("click", addTab);
    $("#hh-close", panel).addEventListener("click", () => setVisible(false));
    $("#hh-minimize", panel).addEventListener("click", () => {
      panel.classList.toggle("hh-minimized");
    });

    $("#hh-tabs", panel).addEventListener("click", (event) => {
      const button = event.target.closest("[data-tab-id]");
      if (!button) return;
      state.activeTabId = Number(button.dataset.tabId);
      render();
    });

    $("#hh-main", panel).addEventListener("click", handleMainClick);
    $("#hh-main", panel).addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target.id === "hh-course-code") search();
    });

    return panel;
  }

  function setVisible(visible) {
    state.visible = visible;
    const panel = ensurePanel();
    panel.classList.toggle("hh-hidden", !visible);
    if (visible) render();
  }

  function addTab() {
    const id = state.nextTabId++;
    state.tabs.push({
      id,
      title: `Tra cứu ${id}`,
      code: "",
      view: "search",
      iframe: null
    });
    state.activeTabId = id;
    render();
  }

  function renderTabs() {
    $("#hh-tabs").innerHTML = state.tabs.map((tab) => `
      <button class="hh-tab ${tab.id === state.activeTabId ? "active" : ""}"
              data-tab-id="${tab.id}">
        ${Utils.escapeHTML(tab.title)}
      </button>
    `).join("");
  }

  function renderSearch(tab) {
    return `
      <section class="hh-search-view">
        <div class="hh-search-row">
          <input id="hh-course-code" value="${Utils.escapeHTML(tab.code)}"
                 placeholder="Nhập mã học phần, ví dụ TIN4313">
          <button id="hh-search-button" class="primary">Tra cứu</button>
        </div>
        <div id="hh-message" class="hh-message">
          Nhập mã học phần để xem các lớp được mở.
        </div>
        <div id="hh-results"></div>
      </section>`;
  }

  function renderRegistration(tab) {
    return `
      <section class="hh-registration-view">
        <div class="hh-toolbar">
          <button data-action="back">← Quay lại</button>
          <button data-action="reload">↻ Tải lại</button>
          <button data-action="open-full">Mở toàn trang</button>
        </div>
        <p class="hh-notice">
          Nếu HUSC cho phép nhúng, trang đăng ký sẽ hiển thị bên dưới.
          Nếu trình duyệt báo bị từ chối hiển thị, hãy chọn “Mở toàn trang”.
        </p>
        <div id="hh-frame-host" class="hh-frame-host"></div>
      </section>`;
  }

  function render() {
    const panel = ensurePanel();
    renderTabs();
    const tab = getActiveTab();
    const main = $("#hh-main");

    if (tab.view === "registration") {
      main.innerHTML = renderRegistration(tab);
      const host = $("#hh-frame-host", main);

      if (!tab.iframe) {
        tab.iframe = document.createElement("iframe");
        tab.iframe.className = "hh-registration-frame";
        tab.iframe.title = "Trang đăng ký học phần HUSC";
        tab.iframe.referrerPolicy = "strict-origin-when-cross-origin";
        tab.iframe.src = tab.registrationUrl;
      }
      host.appendChild(tab.iframe);
      return;
    }

    if (tab.view === "details") {
      main.innerHTML = `
        <div class="hh-toolbar">
          <button data-action="back">← Quay lại danh sách</button>
        </div>
        <div id="hh-details" class="hh-details">Đang tải chi tiết...</div>`;
      loadDetails(tab);
      return;
    }

    main.innerHTML = renderSearch(tab);
    $("#hh-course-code").addEventListener("input", (event) => {
      tab.code = event.target.value;
    });
    $("#hh-search-button").addEventListener("click", search);
  }

  async function search() {
    const tab = getActiveTab();
    const input = $("#hh-course-code");
    if (!tab || !input) return;

    tab.code = input.value.trim();
    const message = $("#hh-message");
    const results = $("#hh-results");
    message.textContent = "Đang tra cứu...";
    results.innerHTML = "";

    try {
      const courses = await CourseService.searchClasses(tab.code);
      message.textContent = courses.length
        ? `Tìm thấy ${courses.length} lớp học phần.`
        : "Không tìm thấy lớp nào. Hãy kiểm tra mã học phần.";

      results.innerHTML = courses.map(Card.render).join("");
    } catch (error) {
      message.textContent = error.message || "Có lỗi khi tra cứu.";
    }
  }

  function handleMainClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const tab = getActiveTab();

    if (action === "register") {
      const classCode = button.dataset.code;
      tab.registrationUrl = new URL(
        `/Studying/CourseRegistration/${encodeURIComponent(classCode)}/`,
        window.location.origin
      ).href;
      tab.view = "registration";
      tab.iframe = null;
      render();
    } else if (action === "details") {
      tab.selectedClassCode = button.dataset.code;
      tab.view = "details";
      render();
    } else if (action === "back") {
      tab.view = "search";
      render();
    } else if (action === "reload") {
      if (tab.iframe) tab.iframe.src = tab.registrationUrl;
    } else if (action === "open-full") {
      // Mở trong tab hiện tại để giữ phiên đăng nhập HUSC.
      window.location.href = tab.registrationUrl;
    }
  }

  async function loadDetails(tab) {
    try {
      const details = await CourseService.getClassDetails(tab.selectedClassCode);
      const target = $("#hh-details");
      if (!target) return;
      const entries = Object.entries(details);
      target.innerHTML = entries.length
        ? entries.map(([key, value]) => `
            <div class="hh-detail-row">
              <strong>${Utils.escapeHTML(key)}</strong>
              <span>${Utils.escapeHTML(value)}</span>
            </div>`).join("")
        : "Không đọc được thông tin chi tiết từ trang HUSC.";
    } catch (error) {
      const target = $("#hh-details");
      if (target) target.textContent = error.message;
    }
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "HUSC_HELPER_TOGGLE") {
      setVisible(!state.visible);
    }
  });

  // Panel được tạo khi người dùng nhấn biểu tượng extension lần đầu.
})();