import React from 'react';

const HTMLWrapper = ({ children }) => {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {children}
    </>
  );
};

export default HTMLWrapper;
