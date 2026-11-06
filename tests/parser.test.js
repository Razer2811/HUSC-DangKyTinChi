// Chạy: node tests/parser.test.js
// Kiểm tra nhanh các hàm tiện ích độc lập.
const assert = require("node:assert/strict");

function isValidCourseCode(value) {
  return /^[A-Za-z0-9.-]{3,60}$/.test(String(value ?? "").trim());
}

assert.equal(isValidCourseCode("TIN4313"), true);
assert.equal(isValidCourseCode("LLCTKT2"), true);
assert.equal(isValidCourseCode("2024-2025.2.LLCTKT2.001"), true);
assert.equal(isValidCourseCode(""), false);
assert.equal(isValidCourseCode("TIN 4313"), false);

console.log("All parser input tests passed.");