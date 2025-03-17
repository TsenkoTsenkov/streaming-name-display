// Create this as a new file: DisplayOnly.js
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';

// This file is now deprecated and only exists for backward compatibility
// It redirects to the new display page using URL parameters

const DisplayOnly = () => {
  return <Navigate to="/?display=true" replace />;
};

export default DisplayOnly;
