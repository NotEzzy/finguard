'use client';

import { useEffect, useState } from 'react';
import { Pie } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useAuthStore } from '../../lib/store/authStore';

type RiskData = {
  type: string;
  value: number;
};

export default function RiskChart() {
  const [data, setData] = useState<RiskData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchRiskData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(transactionsQuery);
        
        // Count transactions by risk level
        const riskCounts = {
          safe: 0,
          suspicious: 0,
          fraudulent: 0,
        };
        
        querySnapshot.docs.forEach(doc => {
          const { riskLevel } = doc.data();
          if (riskLevel in riskCounts) {
            riskCounts[riskLevel as keyof typeof riskCounts]++;
          }
        });
        
        // Format data for the chart
        const chartData = Object.entries(riskCounts).map(([type, value]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          value,
        }));
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching risk data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center p-6"><Spin /></div>;
  }

  if (data.length === 0 || data.every(item => item.value === 0)) {
    return <Empty description="No transaction data available" />;
  }

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    legend: {
      position: 'right' as const,
    },
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    colors: ['#52c41a', '#faad14', '#f5222d'],
    interactions: [{ type: 'element-active' }],
  };

  return <Pie {...config} />;
} 