'use client';

import { useState } from 'react';
import { Card, Typography, Avatar, Button, Row, Col, Descriptions, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../lib/store/authStore';

const { Title } = Typography;

type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  country: string;
  cityState: string;
  postalCode: string;
  taxId: string;
  role: string;
  location: string;
};

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profileData] = useState<ProfileData>({
    firstName: 'Jack',
    lastName: 'Adams',
    email: 'jackadams@gmail.com',
    phone: '(213) 555-1234',
    bio: 'Product Designer',
    country: 'United States of America',
    cityState: 'California,USA',
    postalCode: 'ERT 62574',
    taxId: 'AS564178969',
    role: 'Product Designer',
    location: 'Los Angeles, California, USA',
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Title level={2}>My Profile</Title>

      {/* Profile Header Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar size={80} src={user?.photoURL} />
            <div>
              <Title level={3} className="!mb-0">
                {`${profileData.firstName} ${profileData.lastName}`}
              </Title>
              <Typography.Text type="secondary">{profileData.role}</Typography.Text>
              <div>
                <Typography.Text type="secondary">{profileData.location}</Typography.Text>
              </div>
            </div>
          </div>
          <Button icon={<EditOutlined />}>Edit</Button>
        </div>
      </Card>

      {/* Personal Information Card */}
      <Card
        title={
          <div className="flex justify-between items-center">
            <span>Personal Information</span>
            <Button type="text" icon={<EditOutlined />}>Edit</Button>
          </div>
        }
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Space direction="vertical" className="w-full">
              <div>
                <Typography.Text type="secondary">First Name</Typography.Text>
                <div>{profileData.firstName}</div>
              </div>
              <div className="mt-4">
                <Typography.Text type="secondary">Email address</Typography.Text>
                <div>{profileData.email}</div>
              </div>
              <div className="mt-4">
                <Typography.Text type="secondary">Bio</Typography.Text>
                <div>{profileData.bio}</div>
              </div>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" className="w-full">
              <div>
                <Typography.Text type="secondary">Last Name</Typography.Text>
                <div>{profileData.lastName}</div>
              </div>
              <div className="mt-4">
                <Typography.Text type="secondary">Phone</Typography.Text>
                <div>{profileData.phone}</div>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Address Card */}
      <Card
        title={
          <div className="flex justify-between items-center">
            <span>Address</span>
            <Button type="text" icon={<EditOutlined />}>Edit</Button>
          </div>
        }
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Space direction="vertical" className="w-full">
              <div>
                <Typography.Text type="secondary">Country</Typography.Text>
                <div>{profileData.country}</div>
              </div>
              <div className="mt-4">
                <Typography.Text type="secondary">Postal Code</Typography.Text>
                <div>{profileData.postalCode}</div>
              </div>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" className="w-full">
              <div>
                <Typography.Text type="secondary">City/State</Typography.Text>
                <div>{profileData.cityState}</div>
              </div>
              <div className="mt-4">
                <Typography.Text type="secondary">TAX ID</Typography.Text>
                <div>{profileData.taxId}</div>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
