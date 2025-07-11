import React from 'react';
import { AlertCircle, RefreshCw, User, Calendar } from 'lucide-react';

const ErrorDisplay = ({ error, onRetry, searchParams }) => {
  const getErrorDetails = () => {
    if (error.type === 'NO_RECORDS') {
      return {
        title: 'No Records Found',
        message: `No attendance or payroll records found for mobile ${searchParams?.mobile} in ${searchParams?.month}`,
        suggestions: [
          'Double-check the mobile number',
          'Try a different month',
          'Verify the employee exists in the system',
          'Contact HR if you believe this is an error'
        ],
        icon: <User className="w-12 h-12 text-blue-500" />
      };
    }
    
    if (error.type === 'PARTIAL_DATA') {
      return {
        title: 'Partial Data Available',
        message: error.message,
        suggestions: [
          'Some records may be missing for this period',
          'Contact HR to verify data completeness',
          'Try a different month to see if more data is available'
        ],
        icon: <Calendar className="w-12 h-12 text-yellow-500" />
      };
    }
    
    return {
      title: 'Something Went Wrong',
      message: error.message || 'Unable to fetch employee data',
      suggestions: [
        'Check your internet connection',
        'Try again in a few moments',
        'Contact support if the problem persists'
      ],
      icon: <AlertCircle className="w-12 h-12 text-red-500" />
    };
  };

  const { title, message, suggestions, icon } = getErrorDetails();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
      <div className="flex flex-col items-center space-y-4">
        {icon}
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 max-w-md">{message}</p>
        </div>

        {suggestions && (
          <div className="bg-gray-50 rounded-lg p-4 max-w-md">
            <h4 className="font-semibold text-gray-900 mb-2">Suggestions:</h4>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;