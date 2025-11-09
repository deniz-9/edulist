export const MESSAGES = {
  SUCCESS: {
    STUDENT_ADDED: "Öğrenci başarıyla eklendi!",
    COURSE_ADDED: "Ders başarıyla eklendi!",
    EXAM_RESULT_ADDED: "Sınav notu başarıyla eklendi!",
  },
  ERROR: {
    FILL_ALL_FIELDS: "Lütfen tüm alanları doldurun.",
    COURSE_NAME_REQUIRED: "Lütfen ders adını girin.",
    SCORE_RANGE: "Not 0-100 arasında olmalıdır.",
  },
};

export const VALIDATION_MESSAGES = {
  EMAIL_EMPTY: "E-posta adresi boş olamaz.",
  EMAIL_REQUIRES_AT: "E-posta adresi @ işareti içermelidir.",
  EMAIL_INVALID_FORMAT: "Geçerli bir e-posta adresi giriniz.",
  EMAIL_NO_LOCAL_PART:
    "E-posta adresinde @ işaretinden önce en az bir karakter olmalıdır.",
  EMAIL_NO_DOMAIN:
    "E-posta adresinde @ işaretinden sonra domain adı olmalıdır.",
  EMAIL_NO_DOT: "E-posta adresinde domain kısmında nokta (.) olmalıdır.",
  EMAIL_INVALID_DOMAIN:
    "Domain uzantısı en az 2 karakter olmalıdır (örn: .com, .edu).",
  EMAIL_INVALID_CHARS: "E-posta adresinde geçersiz karakterler bulunmaktadır.",
  EMAIL_TOO_LONG: "E-posta adresi çok uzun (maksimum 254 karakter).",
  GSM_EMPTY: "GSM numarası boş olamaz.",
  GSM_MAX_LENGTH: "GSM numarası en fazla 12 basamaklı olmalıdır.",
  DUPLICATE_NAME: "Bu ad soyad ile kayıtlı bir öğrenci zaten mevcut.",
  DUPLICATE_NUMBER: "Bu öğrenci numarası ile kayıtlı bir öğrenci zaten mevcut.",
  DUPLICATE_EMAIL: "Bu e-posta adresi ile kayıtlı bir öğrenci zaten mevcut.",
  DUPLICATE_GSM: "Bu GSM numarası ile kayıtlı bir öğrenci zaten mevcut.",
};

const GSM_MAX_LENGTH = 12;
const SCORE_MIN = 0;
const SCORE_MAX = 100;

export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return VALIDATION_MESSAGES.EMAIL_EMPTY;
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length > 254) {
    return VALIDATION_MESSAGES.EMAIL_TOO_LONG;
  }

  if (!trimmedEmail.includes("@")) {
    return VALIDATION_MESSAGES.EMAIL_REQUIRES_AT;
  }

  const parts = trimmedEmail.split("@");
  if (parts.length !== 2) {
    return VALIDATION_MESSAGES.EMAIL_INVALID_FORMAT;
  }

  const [localPart, domain] = parts;

  if (!localPart || localPart.length === 0) {
    return VALIDATION_MESSAGES.EMAIL_NO_LOCAL_PART;
  }

  if (localPart.length > 64) {
    return VALIDATION_MESSAGES.EMAIL_INVALID_FORMAT;
  }

  if (!domain || domain.length === 0) {
    return VALIDATION_MESSAGES.EMAIL_NO_DOMAIN;
  }

  if (!domain.includes(".")) {
    return VALIDATION_MESSAGES.EMAIL_NO_DOT;
  }

  const domainParts = domain.split(".");
  const extension = domainParts[domainParts.length - 1];
  if (!extension || extension.length < 2) {
    return VALIDATION_MESSAGES.EMAIL_INVALID_DOMAIN;
  }

  const localPartRegex = /^[a-zA-Z0-9._+-]+$/;
  const domainRegex = /^[a-zA-Z0-9.-]+$/;

  if (!localPartRegex.test(localPart)) {
    return VALIDATION_MESSAGES.EMAIL_INVALID_CHARS;
  }

  if (!domainRegex.test(domain)) {
    return VALIDATION_MESSAGES.EMAIL_INVALID_CHARS;
  }

  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return VALIDATION_MESSAGES.EMAIL_INVALID_FORMAT;
  }

  if (
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.startsWith("-") ||
    domain.endsWith("-")
  ) {
    return VALIDATION_MESSAGES.EMAIL_INVALID_FORMAT;
  }

  if (localPart.includes("..") || domain.includes("..")) {
    return VALIDATION_MESSAGES.EMAIL_INVALID_FORMAT;
  }

  return null;
};

export const validateGsm = (gsm) => {
  const normalizedGsm = gsm.replace(/\D/g, "");
  if (normalizedGsm.length === 0) {
    return VALIDATION_MESSAGES.GSM_EMPTY;
  }
  if (normalizedGsm.length > GSM_MAX_LENGTH) {
    return VALIDATION_MESSAGES.GSM_MAX_LENGTH;
  }
  return null;
};

export const validateScore = (score) => {
  const numScore = parseFloat(score);
  if (isNaN(numScore) || numScore < SCORE_MIN || numScore > SCORE_MAX) {
    return MESSAGES.ERROR.SCORE_RANGE;
  }
  return null;
};

export const checkStudentDuplicates = (formData, students) => {
  const errors = {};
  const normalizedEmail = formData.email?.toLowerCase().trim();
  const normalizedGsm = formData.gsm_number?.replace(/\D/g, "");
  const normalizedName = formData.full_name?.trim();
  const normalizedNumber = formData.number?.trim();

  const duplicateName = students.find(
    (student) =>
      student.full_name.trim().toLowerCase() === normalizedName?.toLowerCase()
  );
  if (duplicateName) {
    errors.full_name = VALIDATION_MESSAGES.DUPLICATE_NAME;
  }

  const duplicateNumber = students.find(
    (student) => student.number.trim() === normalizedNumber
  );
  if (duplicateNumber) {
    errors.number = VALIDATION_MESSAGES.DUPLICATE_NUMBER;
  }

  const emailValidationError = validateEmail(formData.email);
  if (!emailValidationError && normalizedEmail) {
    const duplicateEmail = students.find(
      (student) => student.email.toLowerCase().trim() === normalizedEmail
    );
    if (duplicateEmail) {
      errors.email = VALIDATION_MESSAGES.DUPLICATE_EMAIL;
    }
  }

  if (
    normalizedGsm &&
    normalizedGsm.length > 0 &&
    normalizedGsm.length <= GSM_MAX_LENGTH
  ) {
    const duplicateGsm = students.find(
      (student) => student.gsm_number.replace(/\D/g, "") === normalizedGsm
    );
    if (duplicateGsm) {
      errors.gsm_number = VALIDATION_MESSAGES.DUPLICATE_GSM;
    }
  }

  return errors;
};

export const sanitizeGsm = (value, maxLength = GSM_MAX_LENGTH) => {
  const numericValue = value.replace(/\D/g, "");
  return numericValue.length <= maxLength
    ? numericValue
    : numericValue.slice(0, maxLength);
};

export const getMessageClass = (message) => {
  return message.includes("başarıyla")
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
};
