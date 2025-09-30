'use client';

import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin } from 'antd';
import { DollarOutlined, AlertOutlined, SafetyOutlined } from '@ant-design/icons';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useAuthStore } from '../../lib/store/authStore';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import AlertsWidget from '../../components/dashboard/AlertsWidget';
import RiskChart from '../../components/dashboard/RiskChart';

const { Title } = Typography;

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    alertsCount: 0,
    safePercentage: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get transactions count
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', user.uid)
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        
        // Get alerts count
        const alertsQuery = query(
          collection(db, 'alerts'),
          where('userId', '==', user.uid),
          where('status', '==', 'unresolved')
        );
        const alertsSnapshot = await getDocs(alertsQuery);
        
        // Calculate safe percentage
        const totalTransactions = transactionsSnapshot.size;
        const safeTransactions = transactionsSnapshot.docs.filter(
          doc => doc.data().riskLevel === 'safe'
        ).length;
        
        setStats({
          totalTransactions,
          alertsCount: alertsSnapshot.size,
          safePercentage: totalTransactions ? Math.round(safeTransactions / totalTransactions * 100) : 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Transactions"
              value={stats.totalTransactions}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Alerts"
              value={stats.alertsCount}
              prefix={<AlertOutlined />}
              valueStyle={{ color: stats.alertsCount > 0 ? '#cf1322' : undefined }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Safe Transactions"
              value={stats.safePercentage}
              prefix={<SafetyOutlined />}
              suffix="%"
              valueStyle={{ color: stats.safePercentage > 90 ? '#3f8600' : undefined }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <RecentTransactions />
        </Col>
        <Col xs={24} lg={8}>
          <AlertsWidget />
        </Col>
      </Row>
      
      <Row>
        <Col xs={24}>
          <Card title="Risk Assessment">
            <RiskChart />
          </Card>
        </Col>
      </Row>
    </div>
  );
} 