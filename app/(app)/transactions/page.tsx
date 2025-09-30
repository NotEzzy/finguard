'use client';

import { useEffect, useState } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Typography, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Button 
} from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useAuthStore } from '../../lib/store/authStore';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '../../lib/utils/formatters';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
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
          orderBy('date', 'desc')
        );
        
        const querySnapshot = await getDocs(transactionsQuery);
        const transactionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Transaction));
        
        setTransactions(transactionsData);
        setFilteredTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  useEffect(() => {
    // Apply filters when search text or risk filter changes
    const filtered = transactions.filter(transaction => {
      // Search filter
      const searchMatch = 
        transaction.merchant.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchText.toLowerCase());
      
      // Risk level filter
      const riskMatch = riskFilter === 'all' || transaction.riskLevel === riskFilter;
      
      return searchMatch && riskMatch;
    });
    
    setFilteredTransactions(filtered);
  }, [searchText, riskFilter, transactions]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => formatDate(text),
      sorter: (a: Transaction, b: Transaction) => 
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Merchant',
      dataIndex: 'merchant',
      key: 'merchant',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
      sorter: (a: Transaction, b: Transaction) => a.amount - b.amount,
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
      filters: [
        { text: 'Safe', value: 'safe' },
        { text: 'Suspicious', value: 'suspicious' },
        { text: 'Fraudulent', value: 'fraudulent' },
      ],
      onFilter: (value: string | number | boolean, record: Transaction) => record.riskLevel === value as string,
    },
  ];

  return (
    <div className="space-y-6">
      <Title level={2}>Transactions</Title>
      
      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search transactions..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="max-w-md"
          />
          
          <Space>
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={value => setRiskFilter(value)}
            >
              <Option value="all">All Risk Levels</Option>
              <Option value="safe">Safe</Option>
              <Option value="suspicious">Suspicious</Option>
              <Option value="fraudulent">Fraudulent</Option>
            </Select>
            
            <RangePicker className="hidden md:block" />
          </Space>
        </div>
        
        <Table
          dataSource={filteredTransactions}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => router.push(`/transactions/${record.id}`),
          })}
          className="cursor-pointer"
        />
      </Card>
    </div>
  );
} 