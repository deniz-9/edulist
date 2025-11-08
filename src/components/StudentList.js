import React, { useState } from "react";
import { useData } from "../context/DataContext";
import StudentDetail from "./StudentDetail";

const StudentList = () => {
  const { students, examResults, deleteStudent } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

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
    }
  };

  if (selectedStudent) {
    return (
      <div>
        <button
          onClick={() => setSelectedStudent(null)}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Listeye Dön
        </button>
        <StudentDetail student={selectedStudent} />
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
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Detay
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteStudent(student.id, student.full_name)
                        }
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
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
