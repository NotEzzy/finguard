'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Card, 
  Typography, 
  Descriptions, 
  Tag, 
  Button, 
  Space, 
  Divider, 
  Alert, 
  Spin, 
  Modal, 
  message 
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined,
  FlagOutlined
} from '@ant-design/icons';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase/config';
import { useAuthStore } from '../../../lib/store/authStore';
import { formatCurrency, formatDateTime } from '../../../lib/utils/formatters';

const { Title, Text } = Typography;
const { confirm } = Modal;

type Transaction = {
  id: string;
  date: string;
  amount: number;
  merchant: string;
  description: string;
  category: string;
  riskLevel: 'safe' | 'suspicious' | 'fraudulent';
  flagged: boolean;
  cardLast4: string;
  location: string;
};

const riskColors = {
  safe: 'success',
  suspicious: 'warning',
  fraudulent: 'error',
};

export default function TransactionDetailPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!user || !id) return;
      
      try {
        setLoading(true);
        const docRef = doc(db, 'transactions', id as string);
        const docSnapshot = await getDoc(docRef);
        
        if (docSnapshot.exists()) {
          setTransaction({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as Transaction);
        } else {
          message.error('Transaction not found');
          router.push('/transactions');
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
        message.error('Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [user, id, router]);

  const handleConfirmTransaction = async () => {
    confirm({
      title: 'Confirm Transaction',
      icon: <CheckCircleOutlined style={{ color: 'green' }} />,
      content: 'Are you sure this transaction is legitimate? This will mark it as safe.',
      async onOk() {
        try {
          await updateDoc(doc(db, 'transactions', id as string), {
            riskLevel: 'safe',
            flagged: false,
          });
          
          // Also update any related alerts
          await addDoc(collection(db, 'alerts'), {
            userId: user?.uid,
            transactionId: id,
            title: 'Transaction Confirmed',
            message: `You confirmed the transaction of ${formatCurrency(transaction?.amount || 0)} to ${transaction?.merchant}`,
            severity: 'low',
            status: 'resolved',
            date: new Date().toISOString(),
          });
          
          message.success('Transaction confirmed as safe');
          setTransaction(prev => prev ? {...prev, riskLevel: 'safe', flagged: false} : null);
        } catch (error) {
          console.error('Error confirming transaction:', error);
          message.error('Failed to confirm transaction');
        }
      },
    });
  };

  const handleReportFraud = async () => {
    confirm({
      title: 'Report Fraud',
      icon: <CloseCircleOutlined style={{ color: 'red' }} />,
      content: 'Are you sure this transaction is fraudulent? This will initiate an investigation.',
      async onOk() {
        try {
          await updateDoc(doc(db, 'transactions', id as string), {
            riskLevel: 'fraudulent',
            flagged: true,
          });
          
          // Create a fraud alert
          await addDoc(collection(db, 'alerts'), {
            userId: user?.uid,
            transactionId: id,
            title: 'Fraud Reported',
            message: `You reported fraud for the transaction of ${formatCurrency(transaction?.amount || 0)} to ${transaction?.merchant}`,
            severity: 'high',
            status: 'unresolved',
            date: new Date().toISOString(),
          });
          
          message.success('Fraud report submitted');
          setTransaction(prev => prev ? {...prev, riskLevel: 'fraudulent', flagged: true} : null);
        } catch (error) {
          console.error('Error reporting fraud:', error);
          message.error('Failed to report fraud');
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  if (!transaction) {
    return <div>Transaction not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Title level={2} className="m-0">Transaction Details</Title>
      </div>
      
      {transaction.riskLevel !== 'safe' && (
        <Alert
          message={transaction.riskLevel === 'fraudulent' ? 'Fraudulent Transaction' : 'Suspicious Activity'}
          description={
            transaction.riskLevel === 'fraudulent' 
              ? 'This transaction has been identified as potentially fraudulent. Please review and take action.'
              : 'This transaction has unusual patterns. Please verify if this was a legitimate purchase.'
          }
          type={transaction.riskLevel === 'fraudulent' ? 'error' : 'warning'}
          showIcon
          className="mb-4"
        />
      )}
      
      <Card>
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} size="small">
          <Descriptions.Item label="Merchant">{transaction.merchant}</Descriptions.Item>
          <Descriptions.Item label="Amount">{formatCurrency(transaction.amount)}</Descriptions.Item>
          <Descriptions.Item label="Date">{formatDateTime(transaction.date)}</Descriptions.Item>
          <Descriptions.Item label="Category">{transaction.category}</Descriptions.Item>
          <Descriptions.Item label="Card">{`•••• ${transaction.cardLast4}`}</Descriptions.Item>
          <Descriptions.Item label="Location">{transaction.location}</Descriptions.Item>
          <Descriptions.Item label="Risk Level">
            <Tag color={riskColors[transaction.riskLevel]}>
              {transaction.riskLevel.charAt(0).toUpperCase() + transaction.riskLevel.slice(1)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {transaction.flagged ? (
              <Tag color="red">Flagged for Review</Tag>
            ) : (
              <Tag color="green">Processed</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <div>
          <Title level={5}>Description</Title>
          <Text>{transaction.description}</Text>
        </div>
        
        <Divider />
        
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />}
            onClick={handleConfirmTransaction}
            disabled={transaction.riskLevel === 'safe' && !transaction.flagged}
          >
            Confirm Transaction
          </Button>
          
          <Button 
            danger 
            icon={<CloseCircleOutlined />}
            onClick={handleReportFraud}
            disabled={transaction.riskLevel === 'fraudulent'}
          >
            Report Fraud
          </Button>
          
          <Button 
            icon={<FlagOutlined />}
          >
            Request Investigation
          </Button>
        </Space>
      </Card>
    </div>
  );
} 