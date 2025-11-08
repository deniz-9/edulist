import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const ExamResultForm = () => {
  const { students, courses, addExamResult } = useData();
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    score: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.student_id || !formData.course_id || !formData.score) {
      setMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    const score = parseFloat(formData.score);
    if (isNaN(score) || score < 0 || score > 100) {
      setMessage('Not 0-100 arasında olmalıdır.');
      return;
    }

    addExamResult({
      student_id: parseInt(formData.student_id),
      course_id: parseInt(formData.course_id),
      score: score,
    });
    
    setFormData({
      student_id: '',
      course_id: '',
      score: '',
    });
    setMessage('Sınav notu başarıyla eklendi!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Sınav Notu Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Öğrenci
          </label>
          <select
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Öğrenci Seçin</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name} ({student.number})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ders
          </label>
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Ders Seçin</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Not (0-100)
          </label>
          <input
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Örn: 85.5"
          />
        </div>
        {message && (
          <div className={`p-3 rounded-md ${message.includes('başarıyla') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
        >
          Not Ekle
        </button>
      </form>
    </div>
  );
};

export default ExamResultForm;

