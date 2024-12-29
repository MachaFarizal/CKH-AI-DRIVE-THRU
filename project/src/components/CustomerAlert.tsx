import React from 'react';
import { User, Car } from 'lucide-react';
import type { Customer } from '../types';

interface CustomerAlertProps {
  customer: Customer;
}

const CustomerAlert = ({ customer }: CustomerAlertProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="font-medium text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-500">Visit count: {customer.visit_count}</p>
          </div>
        </div>
        {customer.license_plate && (
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium">{customer.license_plate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAlert;