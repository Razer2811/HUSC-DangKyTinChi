
# Ghi chú phát triển

## 1. Luồng hoạt động

- `manifest.json`: Khai báo quyền, service worker và content scripts.
- `src/background/service-worker.js`: Nhận thao tác nhấn icon và gửi lệnh bật/tắt.
- `src/content/content.js`: Tạo bảng nổi, quản lý các tab và iframe.
- `src/services/course.service.js`: Fetch trang cùng origin và phân tích HTML.
- `src/components/course-card.js`: Render từng lớp học phần.
- `src/utils/helpers.js`: Escape HTML và kiểm tra mã đầu vào.

## 2. Kiểm tra lỗi

1. Mở `edge://extensions` hoặc `chrome://extensions`.
2. Tìm HUSC Helper và kiểm tra mục Errors.
3. Mở trang HUSC, nhấn F12 và chọn Console.
4. Kiểm tra tab Network để xem request `/Studying/Courses/{courseCode}/`.
5. Nếu iframe báo `Refused to display`, kiểm tra header `X-Frame-Options` và CSP `frame-ancestors` trong Network.

## 3. Lưu ý về parser

Các selector sau dựa trên HTML của phiên bản userscript trước:

- `table.table-striped tbody tr`
- `small`
- `td`
- `label.control-label`

Nếu HTML thực tế của HUSC thay đổi, cần cập nhật parser dựa trên HTML được website trả về.

## 4. Quản lý tab và iframe

`content.js` giữ mỗi tab thành một `.hh-tab-panel` riêng trong DOM.

Khi chuyển tab, panel chỉ được ẩn hoặc hiện; iframe không bị tháo khỏi DOM. Điều này giúp tránh chủ động hủy browsing context và giảm nguy cơ mất trạng thái trang hoặc CAPTCHA.

Khi người dùng đóng tab, iframe của tab đó được điều hướng về `about:blank` và gỡ khỏi DOM.

Trình duyệt vẫn có thể áp dụng giới hạn riêng đối với iframe. Extension không đọc nội dung iframe khác origin và không thể bỏ qua `X-Frame-Options` hoặc CSP của HUSC.

## 5. Nguyên tắc bảo mật

- Không lưu mật khẩu hoặc thông tin đăng nhập của sinh viên.
- Không thu thập cookie hoặc token phiên đăng nhập.
- Không tự động giải CAPTCHA.
- Không tự động xác nhận đăng ký học phần.
- Người dùng phải tự kiểm tra và xác nhận thao tác trên website chính thức.

## 6. Kiểm thử trước khi phát hành

- Kiểm tra bật và tắt bảng trợ lý.
- Kiểm tra thêm, chuyển đổi và đóng tab.
- Kiểm tra tìm kiếm mã học phần.
- Kiểm tra hiển thị thông tin lớp học phần.
- Kiểm tra iframe và phương án mở trang chính thức.
- Kiểm tra lỗi trên Console và Network.
