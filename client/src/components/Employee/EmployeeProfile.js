import React from 'react';
import { User, Phone, Building, MapPin, Users } from 'lucide-react';

const EmployeeProfile = ({ employee }) => {
  const { basic } = employee;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{basic.name}</h3>
        <p className="text-gray-600">{basic.designation}</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center text-gray-700">
          <Phone className="w-5 h-5 mr-3" />
          <span>{basic.mobile}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Building className="w-5 h-5 mr-3" />
          <span>{basic.department}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <MapPin className="w-5 h-5 mr-3" />
          <span>{basic.city}, {basic.state}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Users className="w-5 h-5 mr-3" />
          <span>{basic.manager}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;