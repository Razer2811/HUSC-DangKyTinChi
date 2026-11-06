# Ghi chú phát triển

## Luồng hoạt động

- `manifest.json`: khai báo quyền, service worker và content scripts.
- `src/background/service-worker.js`: nhận thao tác nhấn icon và gửi lệnh bật/tắt.
- `src/content/content.js`: tạo bảng nổi, quản lý các tab và iframe.
- `src/services/course.service.js`: fetch trang cùng origin và phân tích HTML.
- `src/components/course-card.js`: render từng lớp học phần.
- `src/utils/helpers.js`: escape HTML và kiểm tra mã đầu vào.

## Kiểm tra lỗi

1. Mở `edge://extensions` hoặc `chrome://extensions`.
2. Tìm HUSC Helper và kiểm tra Errors.
3. Mở trang HUSC, nhấn F12 > Console.
4. Kiểm tra tab Network để xem request `/Studying/Courses/{courseCode}/`.
5. Nếu iframe báo `Refused to display`, kiểm tra header `X-Frame-Options` và CSP `frame-ancestors` trong Network.

## Lưu ý cần xác minh

Các selector `table.table-striped tbody tr`, `small`, `td` và nhãn `label.control-label` dựa trên HTML của phiên bản userscript trước. Nếu HTML thực tế khác, cập nhật parser sau khi xem HTML được HUSC trả về.

## Quản lý tab và iframe

`content.js` giữ mỗi tab thành một `.hh-tab-panel` riêng trong DOM. Khi chuyển tab, panel chỉ được ẩn/hiện; iframe không bị tháo khỏi DOM nên tránh chủ động hủy browsing context và giảm nguy cơ mất trạng thái trang/CAPTCHA. Khi người dùng đóng tab, iframe của tab đó được điều hướng về `about:blank` và gỡ khỏi DOM.

Trình duyệt vẫn có thể áp dụng giới hạn riêng đối với iframe. Extension không đọc nội dung iframe khác origin và không thể bỏ qua `X-Frame-Options` / CSP của HUSC.
>>>>>>> 257fdeb (Ho tro dang ky tin chi HUSC v1.0.1)
