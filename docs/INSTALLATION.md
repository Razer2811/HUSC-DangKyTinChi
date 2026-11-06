
# Cài đặt Extension

## 1. Yêu cầu

- Google Chrome hoặc Microsoft Edge.
- Đã tải và giải nén source code của dự án.
- Thư mục dự án phải chứa file `manifest.json`.

## 2. Cài đặt trên Google Chrome

1. Giải nén source code.
2. Mở trình duyệt Chrome.
3. Truy cập `chrome://extensions`.
4. Bật **Developer mode** ở góc trên bên phải.
5. Chọn **Load unpacked**.
6. Chọn thư mục gốc `HUSC-Credit-Registration-Helper`, nơi chứa file `manifest.json`.
7. Kiểm tra Extension đã xuất hiện trong danh sách và không có lỗi.

## 3. Cài đặt trên Microsoft Edge

1. Giải nén source code.
2. Mở trình duyệt Microsoft Edge.
3. Truy cập `edge://extensions`.
4. Bật **Developer mode**.
5. Chọn **Load unpacked**.
6. Chọn thư mục gốc `HUSC-Credit-Registration-Helper`, nơi chứa file `manifest.json`.
7. Kiểm tra Extension đã được tải thành công.

## 4. Cập nhật Extension sau khi sửa source code

Sau khi chỉnh sửa mã nguồn:

1. Mở `chrome://extensions` hoặc `edge://extensions`.
2. Tìm HUSC Credit Registration Helper.
3. Nhấn nút **Reload** trên thẻ Extension.
4. Quay lại trang HUSC và tải lại trang bằng `F5` hoặc `Ctrl + R`.
5. Kiểm tra lại chức năng vừa thay đổi.

## 5. Khắc phục sự cố

### Extension không xuất hiện

- Kiểm tra đã chọn đúng thư mục gốc chứa `manifest.json`.
- Kiểm tra file `manifest.json` có đúng định dạng JSON.
- Kiểm tra phiên bản trình duyệt có hỗ trợ Manifest V3.

### Extension báo lỗi

1. Mở trang Extensions.
2. Tìm Extension và chọn **Errors** nếu có.
3. Kiểm tra thông báo lỗi.
4. Mở Developer Tools trên trang HUSC và kiểm tra Console.

### Không hiển thị trang đăng ký trong iframe

Một số trang có thể chặn nhúng iframe bằng `X-Frame-Options` hoặc CSP `frame-ancestors`.

Trong trường hợp này, hãy sử dụng chức năng mở trang đăng ký chính thức trên toàn trang.

## 6. Lưu ý

- Không chia sẻ tài khoản hoặc mật khẩu HUSC cho người khác.
- Extension không tự động giải CAPTCHA.
- Người dùng tự thực hiện và xác nhận đăng ký trên hệ thống HUSC.
- Chỉ sử dụng Extension khi được phép truy cập hệ thống.
