const multer = require('multer');
const path = require('path');

// Hàm tạo cấu hình lưu trữ động
const createStorage = (folderPath) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folderPath); // Thư mục lưu trữ file (được truyền vào)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname); // Lấy phần mở rộng tệp
      cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Đặt tên tệp
    },
  });
};

// Hàm tạo middleware upload với thư mục tùy chỉnh
const createUploadMiddleware = (folderPath) => {
  return multer({
    storage: createStorage(folderPath),
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước 5MB
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const extName = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimeType = fileTypes.test(file.mimetype);

      if (extName && mimeType) {
        return cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    },
  });
};

module.exports = createUploadMiddleware;
