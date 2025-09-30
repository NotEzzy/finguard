'use client';

import { useEffect, useState } from 'react';
import { Card, List, Badge, Typography, Button, Empty } from 'antd';
import { BellOutlined, RightOutlined } from '@ant-design/icons';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useAuthStore } from '../../lib/store/authStore';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

type Alert = {
  id: string;
  title: string;
  message: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  status: 'unresolved' | 'resolved';
  transactionId: string;
};

export default function AlertsWidget() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const alertsQuery = query(
          collection(db, 'alerts'),
          where('userId', '==', user.uid),
          where('status', '==', 'unresolved'),
          orderBy('date', 'desc'),
          limit(5)
        );
        
        const querySnapshot = await getDocs(alertsQuery);
        const alertsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Alert));
        
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [user]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'blue';
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center">
          <BellOutlined className="mr-2" />
          <Title level={4} className="m-0">Fraud Alerts</Title>
        </div>
      }
      extra={
        <Button 
          type="link" 
          onClick={() => router.push('/alerts')}
        >
          View All <RightOutlined />
        </Button>
      }
      className="h-full"
    >
      <List
        loading={loading}
        dataSource={alerts}
        renderItem={(alert) => (
          <List.Item
            key={alert.id}
            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md p-2"
            onClick={() => router.push(`/transactions/${alert.transactionId}`)}
          >
            <List.Item.Meta
              avatar={
                <Badge 
                  color={getSeverityColor(alert.severity)} 
                  className="mt-2" 
                />
              }
              title={alert.title}
              description={
                <div>
                  <Text type="secondary" className="block">
                    {new Date(alert.date).toLocaleString()}
                  </Text>
                  <Text>{alert.message}</Text>
                </div>
              }
            />
          </List.Item>
        )}
        locale={{
          emptyText: <Empty description="No alerts found" />
        }}
      />
    </Card>
  );
} 