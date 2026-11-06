
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
    tabs: [{
      id: 1,
      title: "Tra cứu 1",
      code: "",
      view: "search",
      courses: [],
      searchMessage: "Nhập mã học phần để xem các lớp được mở.",
      registrationUrl: "",
      selectedClassCode: "",
      details: null,
      detailsLoading: false,
      iframe: null
    }]
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const getActiveTab = () => state.tabs.find((tab) => tab.id === state.activeTabId);
  const getPanel = (id) => $(`#hh-panel-${id}`, $("#hh-main"));

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
      <footer class="hh-footer">
        Công cụ hỗ trợ tra cứu. CAPTCHA và xác nhận đăng ký do bạn tự thực hiện.
      </footer>
    `;
    document.documentElement.appendChild(panel);

    $("#hh-add-tab", panel).addEventListener("click", addTab);
    $("#hh-close", panel).addEventListener("click", () => setVisible(false));
    $("#hh-minimize", panel).addEventListener("click", () => {
      panel.classList.toggle("hh-minimized");
    });

    $("#hh-tabs", panel).addEventListener("click", (event) => {
      const closeButton = event.target.closest("[data-close-tab]");
      if (closeButton) {
        closeTab(Number(closeButton.dataset.closeTab));
        return;
      }

      const tabButton = event.target.closest("[data-tab-id]");
      if (!tabButton) return;
      state.activeTabId = Number(tabButton.dataset.tabId);
      render();
    });

    $("#hh-main", panel).addEventListener("click", handleMainClick);

    $("#hh-main", panel).addEventListener("input", (event) => {
      if (event.target.matches("[data-course-input]")) {
        const tab = state.tabs.find(
          (item) => item.id === Number(event.target.dataset.tabId)
        );
        if (tab) tab.code = event.target.value;
      }
    });

    $("#hh-main", panel).addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" &&
        event.target.matches("[data-course-input]")
      ) {
        search(Number(event.target.dataset.tabId));
      }
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
      courses: [],
      searchMessage: "Nhập mã học phần để xem các lớp được mở.",
      registrationUrl: "",
      selectedClassCode: "",
      details: null,
      detailsLoading: false,
      iframe: null
    });

    state.activeTabId = id;
    render();
  }

  function closeTab(id) {
    const index = state.tabs.findIndex((tab) => tab.id === id);
    if (index < 0) return;

    const tab = state.tabs[index];

    if (tab.iframe) {
      tab.iframe.src = "about:blank";
      tab.iframe.remove();
    }

    state.tabs.splice(index, 1);

    if (state.tabs.length === 0) {
      state.tabs.push({
        id: state.nextTabId++,
        title: `Tra cứu ${state.nextTabId - 1}`,
        code: "",
        view: "search",
        courses: [],
        searchMessage: "Nhập mã học phần để xem các lớp được mở.",
        registrationUrl: "",
        selectedClassCode: "",
        details: null,
        detailsLoading: false,
        iframe: null
      });
    }

    if (!state.tabs.some((item) => item.id === state.activeTabId)) {
      state.activeTabId = state.tabs[Math.max(0, index - 1)].id;
    }

    render();
  }

  function renderTabs() {
    $("#hh-tabs").innerHTML = state.tabs.map((tab) => `
      <div class="hh-tab-wrap ${tab.id === state.activeTabId ? "active" : ""}">
        <button class="hh-tab" data-tab-id="${tab.id}">
          ${Utils.escapeHTML(tab.title)}
        </button>
        ${state.tabs.length > 1
          ? `<button class="hh-tab-close" data-close-tab="${tab.id}" title="Đóng tab">×</button>`
          : ""}
      </div>
    `).join("");
  }

  function createTabPanel(tab) {
    const panel = document.createElement("section");
    panel.id = `hh-panel-${tab.id}`;
    panel.className = "hh-tab-panel";

    panel.innerHTML = `
      <section class="hh-search-view">
        <div class="hh-search-row">
          <input data-course-input data-tab-id="${tab.id}"
                 placeholder="Nhập mã học phần, ví dụ TIN4313"
                 autocomplete="off">
          <button data-action="search" data-tab-id="${tab.id}" class="primary">Tra cứu</button>
        </div>
        <div class="hh-message" data-message-for="${tab.id}"></div>
        <div class="hh-results" data-results-for="${tab.id}"></div>
      </section>

      <section class="hh-details-view" hidden>
        <div class="hh-toolbar">
          <button data-action="back" data-tab-id="${tab.id}">← Quay lại danh sách</button>
        </div>
        <div class="hh-details" data-details-for="${tab.id}"></div>
      </section>

      <section class="hh-registration-view" hidden>
        <div class="hh-toolbar">
          <button data-action="back" data-tab-id="${tab.id}">← Quay lại</button>
          <button data-action="reload" data-tab-id="${tab.id}">↻ Tải lại</button>
          <button data-action="open-full" data-tab-id="${tab.id}">Mở toàn trang</button>
        </div>
        <p class="hh-notice">
          Trang đăng ký được nhúng nếu máy chủ HUSC cho phép.
          Nếu iframe bị từ chối hiển thị, hãy chọn “Mở toàn trang”.
          CAPTCHA và thao tác xác nhận luôn do bạn thực hiện.
        </p>
        <div class="hh-frame-host" data-frame-host="${tab.id}"></div>
      </section>
    `;

    return panel;
  }

  function ensureTabPanels() {
    const main = $("#hh-main");

    state.tabs.forEach((tab) => {
      let panel = getPanel(tab.id);

      if (!panel) {
        panel = createTabPanel(tab);
        main.appendChild(panel);
      }

      panel.hidden = tab.id !== state.activeTabId;

      const searchView = $(".hh-search-view", panel);
      const detailsView = $(".hh-details-view", panel);
      const registrationView = $(".hh-registration-view", panel);

      searchView.hidden = tab.view !== "search";
      detailsView.hidden = tab.view !== "details";
      registrationView.hidden = tab.view !== "registration";

      const input = $("[data-course-input]", panel);
      if (input && input.value !== tab.code) {
        input.value = tab.code;
      }

      const message = $(`[data-message-for="${tab.id}"]`, panel);
      if (message) message.textContent = tab.searchMessage;

      const results = $(`[data-results-for="${tab.id}"]`, panel);

      if (results && !results.dataset.rendered) {
        results.innerHTML = tab.courses.map(Card.render).join("");
        results.dataset.rendered = "true";
      }

      if (tab.view === "registration") {
        ensureIframe(tab, panel);
      }

      if (tab.view === "details") {
        renderDetails(tab, panel);
      }
    });

    // Dọn panel thuộc các tab đã đóng.
    [...main.querySelectorAll(".hh-tab-panel")].forEach((panel) => {
      const id = Number(panel.id.replace("hh-panel-", ""));

      if (!state.tabs.some((tab) => tab.id === id)) {
        panel.remove();
      }
    });
  }

  function ensureIframe(tab, panel) {
    const host = $(`[data-frame-host="${tab.id}"]`, panel);

    if (!tab.iframe) {
      tab.iframe = document.createElement("iframe");
      tab.iframe.className = "hh-registration-frame";
      tab.iframe.title = "Trang đăng ký học phần HUSC";
      tab.iframe.referrerPolicy = "strict-origin-when-cross-origin";
      tab.iframe.src = tab.registrationUrl;
    }

    if (tab.iframe.parentElement !== host) {
      host.appendChild(tab.iframe);
    }
  }

  function renderDetails(tab, panel) {
    const target = $(`[data-details-for="${tab.id}"]`, panel);
    if (!target) return;

    if (tab.details) {
      target.innerHTML = Object.entries(tab.details).map(([key, value]) => `
        <div class="hh-detail-row">
          <strong>${Utils.escapeHTML(key)}</strong>
          <span>${Utils.escapeHTML(value)}</span>
        </div>
      `).join("") || "Không có dữ liệu chi tiết.";
    } else if (tab.detailsLoading) {
      target.textContent = "Đang tải chi tiết...";
    } else {
      target.textContent = "Chưa tải thông tin chi tiết.";
    }
  }

  function render() {
    ensurePanel();
    renderTabs();
    ensureTabPanels();
  }

  async function search(tabId) {
    const tab = state.tabs.find((item) => item.id === tabId);
    const panel = getPanel(tabId);

    if (!tab || !panel) return;

    const input = $("[data-course-input]", panel);
    tab.code = input.value.trim();
    tab.courses = [];

    const results = $(`[data-results-for="${tabId}"]`, panel);
    results.innerHTML = "";
    results.dataset.rendered = "true";

    tab.searchMessage = "Đang tra cứu...";
    $(`[data-message-for="${tabId}"]`, panel).textContent = tab.searchMessage;

    try {
      const courses = await CourseService.searchClasses(tab.code);

      // Không ghi kết quả cũ đè lên lần tìm kiếm mới.
      if (!state.tabs.includes(tab) || tab.code !== input.value.trim()) {
        return;
      }

      tab.courses = courses;
      tab.searchMessage = courses.length
        ? `Tìm thấy ${courses.length} lớp học phần.`
        : "Không tìm thấy lớp nào. Hãy kiểm tra mã học phần.";

      results.innerHTML = courses.map(Card.render).join("");

      $(`[data-message-for="${tabId}"]`, panel).textContent = tab.searchMessage;
    } catch (error) {
      tab.searchMessage = error.message || "Có lỗi khi tra cứu.";

      $(`[data-message-for="${tabId}"]`, panel).textContent = tab.searchMessage;
    }
  }

  async function openDetails(tab, panel) {
    tab.view = "details";
    tab.details = null;
    tab.detailsLoading = true;

    render();

    try {
      tab.details = await CourseService.getClassDetails(
        tab.selectedClassCode
      );
    } catch (error) {
      tab.details = {
        "Lỗi": error.message || "Không tải được chi tiết lớp."
      };
    } finally {
      tab.detailsLoading = false;

      const currentPanel = getPanel(tab.id);

      if (currentPanel) {
        renderDetails(tab, currentPanel);
      }
    }
  }

  function handleMainClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;

    const tabId = Number(
      button.dataset.tabId ||
      button.closest(".hh-tab-panel")?.id.replace("hh-panel-", "")
    );

    const tab = state.tabs.find((item) => item.id === tabId);
    const panel = getPanel(tabId);

    if (!tab || !panel) return;

    if (action === "search") {
      search(tabId);

    } else if (action === "register") {
      tab.registrationUrl = new URL(
        `/Studying/CourseRegistration/${encodeURIComponent(button.dataset.code)}/`,
        window.location.origin
      ).href;

      tab.view = "registration";
      render();

    } else if (action === "details") {
      tab.selectedClassCode = button.dataset.code;
      openDetails(tab, panel);

    } else if (action === "back") {
      tab.view = "search";
      render();

    } else if (action === "reload") {
      if (tab.iframe) {
        tab.iframe.src = tab.registrationUrl;
      }

    } else if (action === "open-full") {
      window.location.href = tab.registrationUrl;
    }
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "HUSC_HELPER_TOGGLE") {
      setVisible(!state.visible);
    }
  });

  // Panel được tạo khi người dùng nhấn biểu tượng extension lần đầu.
})();
