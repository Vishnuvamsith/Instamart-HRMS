import React from 'react';

const Header = ({ title, subtitle, backButton = null }) => {
  return (
    <div className="mb-8">
      {backButton && (
        <div className="mb-4">
          {backButton}
        </div>
      )}
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};

export default Header;