import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const StudentForm = () => {
  const { addStudent } = useData();
  const [formData, setFormData] = useState({
    full_name: '',
    number: '',
    email: '',
    gsm_number: '',
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
    
    if (!formData.full_name || !formData.number || !formData.email || !formData.gsm_number) {
      setMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    addStudent(formData);
    setFormData({
      full_name: '',
      number: '',
      email: '',
      gsm_number: '',
    });
    setMessage('Öğrenci başarıyla eklendi!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Yeni Öğrenci Ekle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad Soyad
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Örn: Ahmet Yılmaz"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Öğrenci Numarası
          </label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Örn: 2021001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-posta
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Örn: ahmet@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GSM Numarası
          </label>
          <input
            type="text"
            name="gsm_number"
            value={formData.gsm_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Örn: 05551234567"
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
          Öğrenci Ekle
        </button>
      </form>
    </div>
  );
};

export default StudentForm;

