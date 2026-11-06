# HUSC Credit Registration Helper

Chrome/Edge Extension (Manifest V3) hỗ trợ tra cứu lớp học phần trên cổng sinh viên HUSC và mở trang đăng ký trong bảng trợ lý nổi.

> Đây là công cụ hỗ trợ tra cứu. Người dùng phải tự đăng nhập, tự nhập CAPTCHA và tự xác nhận đăng ký trên hệ thống chính thức.

## Tính năng

- Bật/tắt bảng HUSC Helper bằng biểu tượng extension.
- Tra cứu danh sách lớp theo mã học phần.
- Hiển thị thông tin lớp cơ bản và trang chi tiết.
- Mở nhiều tab tra cứu bằng nút `+`.
- Mở trang đăng ký trong iframe nếu HUSC cho phép nhúng.
- Có nút tải lại iframe và mở trang đăng ký toàn trang.

## Cài đặt trên Chrome / Edge

1. Tải hoặc clone repository này về máy.
2. Mở `chrome://extensions` (Chrome) hoặc `edge://extensions` (Edge).
3. Bật **Developer mode / Chế độ nhà phát triển**.
4. Chọn **Load unpacked / Tải tiện ích đã giải nén**.
5. Chọn thư mục gốc `HUSC-Credit-Registration-Helper` (thư mục có `manifest.json`).
6. Đăng nhập `https://student.husc.edu.vn/`.
7. Nhấn biểu tượng HUSC Helper trên thanh công cụ để bật bảng nổi.

## Cách sử dụng

1. Nhập mã học phần, ví dụ `TIN4313`.
2. Nhấn **Tra cứu**.
3. Xem danh sách lớp và thông tin hiển thị.
4. Nhấn **Chi tiết** để xem thông tin lớp.
5. Nhấn **Mở đăng ký** để tải trang đăng ký trong iframe.
6. Nếu iframe bị máy chủ từ chối, nhấn **Mở toàn trang**.

## Giới hạn kỹ thuật

- Iframe chỉ hoạt động nếu máy chủ HUSC cho phép trang đăng ký được nhúng. Các chính sách `X-Frame-Options` hoặc CSP `frame-ancestors` do máy chủ đặt không thể được extension này tự ý vượt qua.
- Nếu HUSC thay đổi HTML, endpoint hoặc cấu trúc bảng, parser trong `src/services/course.service.js` có thể cần cập nhật.
- Hiện tại endpoint và bộ chọn HTML được kế thừa từ cấu trúc đã quan sát trong phiên bản userscript trước; cần kiểm thử lại trên dữ liệu thực tế.
- Khi kỳ đăng ký chưa mở, không thể xác nhận quy trình đăng ký thực tế.

## An toàn và quyền riêng tư

- Không có máy chủ trung gian.
- Không gửi thông tin đăng nhập đến bên thứ ba.
- Không OCR, giải hoặc tự điền CAPTCHA.
- Không tự động gửi biểu mẫu đăng ký.
- Extension chỉ gọi các trang cùng domain HUSC với phiên đăng nhập hiện có của trình duyệt.

## Cấu trúc

```text
HUSC-Credit-Registration-Helper/
├── src/
│   ├── background/service-worker.js
│   ├── content/content.js
│   ├── content/content.css
│   ├── services/course.service.js
│   ├── components/course-card.js
│   └── utils/helpers.js
├── docs/
├── tests/
├── manifest.json
├── README.md
├── LICENSE
└── .gitignore
```

## Phát triển

Xem [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) và [docs/USER_GUIDE.md](docs/USER_GUIDE.md).
