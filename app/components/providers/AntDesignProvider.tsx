'use client';

import React from 'react';
import { ConfigProvider, theme } from 'antd';

export default function AntDesignProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
} 