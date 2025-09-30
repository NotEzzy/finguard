'use client';

import { useEffect, useState } from 'react';
import { Card, Table, Tag, Typography, Button } from 'antd';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useAuthStore } from '../../lib/store/authStore';
import { RightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '../../lib/utils/formatters';

const { Title } = Typography;

type Transaction = {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  description: string;
  category: string;
  riskLevel: 'safe' | 'suspicious' | 'fraudulent';
};

const riskColors = {
  safe: 'success',
  suspicious: 'warning',
  fraudulent: 'error',
};

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc'),
          limit(5)
        );
        
        const querySnapshot = await getDocs(transactionsQuery);
        const transactionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Transaction));
        
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Merchant',
      dataIndex: 'merchant',
      key: 'merchant',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Risk Level',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (risk: 'safe' | 'suspicious' | 'fraudulent') => (
        <Tag color={riskColors[risk]}>
          {risk.charAt(0).toUpperCase() + risk.slice(1)}
        </Tag>
      ),
    },
  ];

  return (
    <Card 
      title={<Title level={4}>Recent Transactions</Title>}
      extra={
        <Button 
          type="link" 
          onClick={() => router.push('/transactions')}
        >
          View All <RightOutlined />
        </Button>
      }
    >
      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        onRow={(record) => ({
          onClick: () => router.push(`/transactions/${record.id}`),
        })}
        className="cursor-pointer"
      />
    </Card>
  );
} 