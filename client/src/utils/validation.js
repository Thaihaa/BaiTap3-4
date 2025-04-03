// Kiểm tra xem một trường là bắt buộc
export const required = (value) => {
  if (!value) return 'Trường này là bắt buộc';
  return '';
};

// Kiểm tra độ dài tối thiểu
export const minLength = (min) => (value) => {
  if (!value) return '';
  if (value.length < min) return `Phải có ít nhất ${min} ký tự`;
  return '';
};

// Kiểm tra độ dài tối đa
export const maxLength = (max) => (value) => {
  if (!value) return '';
  if (value.length > max) return `Không được vượt quá ${max} ký tự`;
  return '';
};

// Kiểm tra định dạng email
export const isEmail = (value) => {
  if (!value) return '';
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(value)) return 'Email không hợp lệ';
  return '';
};

// Kiểm tra định dạng số điện thoại Việt Nam
export const isVietnamesePhone = (value) => {
  if (!value) return '';
  const regex = /^(0|84)([0-9]{9})$/;
  if (!regex.test(value.replace(/\s+/g, ''))) return 'Số điện thoại không hợp lệ';
  return '';
};

// Kiểm tra password mạnh (ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số)
export const isStrongPassword = (value) => {
  if (!value) return '';
  const hasMinLength = value.length >= 8;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  
  if (!hasMinLength) return 'Mật khẩu phải có ít nhất 8 ký tự';
  if (!hasUpperCase) return 'Mật khẩu phải có ít nhất 1 chữ hoa';
  if (!hasLowerCase) return 'Mật khẩu phải có ít nhất 1 chữ thường';
  if (!hasNumber) return 'Mật khẩu phải có ít nhất 1 số';
  
  return '';
};

// Kiểm tra xác nhận mật khẩu
export const matchesPassword = (password) => (value) => {
  if (!value) return '';
  if (value !== password) return 'Mật khẩu xác nhận không khớp';
  return '';
};

// Kiểm tra giá tiền hợp lệ
export const isValidPrice = (value) => {
  if (!value) return '';
  if (isNaN(value) || Number(value) <= 0) return 'Giá phải là số dương';
  return '';
};

// Kiểm tra phần trăm giảm giá hợp lệ
export const isValidDiscount = (value) => {
  if (!value) return '';
  if (isNaN(value) || Number(value) < 0 || Number(value) > 100) {
    return 'Phần trăm giảm giá phải từ 0 đến 100';
  }
  return '';
};

// Kiểm tra URL hợp lệ
export const isValidURL = (value) => {
  if (!value) return '';
  try {
    new URL(value);
    return '';
  } catch (e) {
    return 'URL không hợp lệ';
  }
};

// Kiểm tra ngày hợp lệ (phải lớn hơn ngày hiện tại)
export const isDateInFuture = (value) => {
  if (!value) return '';
  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return 'Ngày phải lớn hơn hoặc bằng ngày hiện tại';
  }
  return '';
};

// Kiểm tra số lượng hợp lệ
export const isPositiveInteger = (value) => {
  if (!value) return '';
  if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
    return 'Phải là số nguyên dương';
  }
  return '';
};

// Kiểm tra đánh giá hợp lệ (từ 1-5)
export const isValidRating = (value) => {
  if (!value) return '';
  const rating = Number(value);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return 'Đánh giá phải từ 1 đến 5';
  }
  return '';
};

// Hàm kiểm tra nhiều điều kiện
export const validate = (value, validators) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return '';
};

// Kiểm tra form
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  for (const key in validationRules) {
    const value = formData[key];
    const validators = validationRules[key];
    
    const error = validate(value, validators);
    if (error) {
      errors[key] = error;
      isValid = false;
    }
  }
  
  return { isValid, errors };
}; 