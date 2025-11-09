import React, { useState } from "react";
import { useData } from "../context/DataContext";
import StudentDetail from "./StudentDetail";
import {
  validateEmail,
  validateGsm,
  checkStudentDuplicates,
  sanitizeGsm,
  getMessageClass,
  MESSAGES,
} from "../utils";
import { Input, Button, Message } from "../ui";
import { FaArrowLeft, FaEye, FaEdit, FaTrash, FaSave } from "react-icons/fa";

const StudentList = () => {
  const { students, examResults, deleteStudent, updateStudent } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [editMessage, setEditMessage] = useState("");

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.full_name.toLowerCase().includes(searchLower) ||
      student.number.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.gsm_number.includes(searchTerm)
    );
  });

  const getStudentExamCount = (studentId) => {
    return examResults.filter((er) => er.student_id === studentId).length;
  };

  const handleDeleteStudent = (studentId, studentName) => {
    if (
      window.confirm(
        `${studentName} adlı öğrenciyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve öğrenciye ait tüm sınav notları da silinecektir.`
      )
    ) {
      deleteStudent(studentId);
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(null);
      }
      if (editingStudent && editingStudent.id === studentId) {
        setEditingStudent(null);
      }
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditFormData({
      full_name: student.full_name,
      number: student.number,
      email: student.email,
      gsm_number: student.gsm_number,
    });
    setEditErrors({});
    setEditMessage("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) {
      setEditErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEditGsmChange = (e) => {
    const sanitized = sanitizeGsm(e.target.value);
    setEditFormData((prev) => ({ ...prev, gsm_number: sanitized }));
    if (editErrors.gsm_number) {
      setEditErrors((prev) => ({ ...prev, gsm_number: "" }));
    }
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (
      !editFormData.full_name ||
      !editFormData.number ||
      !editFormData.email ||
      !editFormData.gsm_number
    ) {
      newErrors.general = MESSAGES.ERROR.FILL_ALL_FIELDS;
      setEditErrors(newErrors);
      return false;
    }

    const emailError = validateEmail(editFormData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const gsmError = validateGsm(editFormData.gsm_number);
    if (gsmError) {
      newErrors.gsm_number = gsmError;
    }

    const otherStudents = students.filter((s) => s.id !== editingStudent.id);
    const duplicateErrors = checkStudentDuplicates(editFormData, otherStudents);
    Object.assign(newErrors, duplicateErrors);

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;

    updateStudent(editingStudent.id, editFormData);
    setEditingStudent(null);
    setEditFormData({});
    setEditErrors({});
    setEditMessage(
      MESSAGES.SUCCESS.STUDENT_ADDED.replace("eklendi", "güncellendi")
    );
    setTimeout(() => setEditMessage(""), 3000);

    if (selectedStudent && selectedStudent.id === editingStudent.id) {
      const updated = students.find((s) => s.id === editingStudent.id);
      if (updated) {
        setSelectedStudent({ ...updated, ...editFormData });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditFormData({});
    setEditErrors({});
    setEditMessage("");
  };

  if (selectedStudent) {
    return (
      <div>
        <button
          onClick={() => setSelectedStudent(null)}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Listeye Dön
        </button>
        <StudentDetail student={selectedStudent} />
      </div>
    );
  }

  if (editingStudent) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Öğrenci Düzenle
        </h2>
        <button
          onClick={handleCancelEdit}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Listeye Dön
        </button>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Ad Soyad"
            name="full_name"
            value={editFormData.full_name}
            onChange={handleEditChange}
            placeholder="Örn: Ahmet Yılmaz"
            error={editErrors.full_name}
          />
          <Input
            label="Öğrenci Numarası"
            name="number"
            value={editFormData.number}
            onChange={handleEditChange}
            placeholder="Örn: 2021001"
            error={editErrors.number}
          />
          <Input
            label="E-posta"
            name="email"
            type="email"
            value={editFormData.email}
            onChange={handleEditChange}
            placeholder="Örn: ahmet@example.com"
            error={editErrors.email}
          />
          <Input
            label="GSM Numarası"
            name="gsm_number"
            value={editFormData.gsm_number}
            onChange={handleEditGsmChange}
            placeholder="Örn: 05551234567"
            maxLength={12}
            error={editErrors.gsm_number}
          />
          <Message
            message={editErrors.general || editMessage}
            getMessageClass={getMessageClass}
          />
          <div className="flex space-x-3">
            <Button
              type="submit"
              variant="primary"
              className="flex-1 flex items-center justify-center"
            >
              <FaSave className="mr-2" />
              Güncelle
            </Button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200 font-medium"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Öğrenci Listesi</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Öğrenci ara (ad, numara, email, telefon)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? "Arama sonucu bulunamadı."
            : "Henüz öğrenci eklenmemiş."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ad Soyad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öğrenci No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GSM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Not
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.gsm_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStudentExamCount(student.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        <FaEye className="mr-1" />
                        Detay
                      </button>
                      <button
                        onClick={() => handleEditClick(student)}
                        className="text-green-600 hover:text-green-800 font-medium flex items-center"
                      >
                        <FaEdit className="mr-1" />
                        Düzenle
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteStudent(student.id, student.full_name)
                        }
                        className="text-red-600 hover:text-red-800 font-medium flex items-center"
                      >
                        <FaTrash className="mr-1" />
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
