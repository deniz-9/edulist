import React, { useState } from "react";
import { useData } from "../context/DataContext";
import {
  validateEmail,
  validateGsm,
  checkStudentDuplicates,
  sanitizeGsm,
  getMessageClass,
  MESSAGES,
} from "../utils";
import { Input, Button, Message } from "../ui";
import { FaUserPlus } from "react-icons/fa";

const StudentForm = () => {
  const { students, addStudent } = useData();
  const [formData, setFormData] = useState({
    full_name: "",
    number: "",
    email: "",
    gsm_number: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGsmChange = (e) => {
    const sanitized = sanitizeGsm(e.target.value);
    setFormData((prev) => ({ ...prev, gsm_number: sanitized }));
    if (errors.gsm_number) {
      setErrors((prev) => ({ ...prev, gsm_number: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.full_name ||
      !formData.number ||
      !formData.email ||
      !formData.gsm_number
    ) {
      newErrors.general = MESSAGES.ERROR.FILL_ALL_FIELDS;
      setErrors(newErrors);
      return false;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const gsmError = validateGsm(formData.gsm_number);
    if (gsmError) {
      newErrors.gsm_number = gsmError;
    }

    const duplicateErrors = checkStudentDuplicates(formData, students);
    Object.assign(newErrors, duplicateErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    addStudent(formData);
    setFormData({ full_name: "", number: "", email: "", gsm_number: "" });
    setErrors({});
    setMessage(MESSAGES.SUCCESS.STUDENT_ADDED);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Yeni Öğrenci Ekle
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Ad Soyad"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Örn: Ahmet Yılmaz"
          error={errors.full_name}
        />
        <Input
          label="Öğrenci Numarası"
          name="number"
          value={formData.number}
          onChange={handleChange}
          placeholder="Örn: 2021001"
          error={errors.number}
        />
        <Input
          label="E-posta"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Örn: ahmet@example.com"
          error={errors.email}
        />
        <Input
          label="GSM Numarası"
          name="gsm_number"
          value={formData.gsm_number}
          onChange={handleGsmChange}
          placeholder="Örn: 05551234567"
          maxLength={12}
          error={errors.gsm_number}
        />
        <Message
          message={errors.general || message}
          getMessageClass={getMessageClass}
        />
        <Button type="submit" variant="primary" className="flex items-center justify-center">
          <FaUserPlus className="mr-2" />
          Öğrenci Ekle
        </Button>
      </form>
    </div>
  );
};

export default StudentForm;
