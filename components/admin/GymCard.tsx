'use client';

import { Card, Tag, Button, Space, Dropdown, Typography, Progress } from 'antd';
import { 
  FaBuilding,
  FaUsers, 
  FaEye,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaCrown,
  FaMapMarkerAlt,
  FaCalendar,
  FaMoneyBillWave,
  FaExclamationTriangle
} from 'react-icons/fa';
import type { AdminGym } from '@/lib/types';

const { Text, Title } = Typography;

interface AdminGymCardProps {
  gym: AdminGym;
  onView: (gymId: string) => void;
  onEdit: (gymId: string) => void;
  onDelete: (gymId: string) => void;
  showActions?: boolean;
}

export default function AdminGymCard({ 
  gym, 
  onView, 
  onEdit, 
  onDelete,
  showActions = true 
}: AdminGymCardProps) {

  const totalStaff = gym.branches.reduce((sum, branch) => sum + branch.staff.length, 0);
  const totalClients = gym.branches.reduce((sum, branch) => sum + branch.clients.length, 0);
  const activeBranches = gym.branches.filter(branch => branch.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'current': return 'success';
      case 'overdue': return 'error';
      default: return 'warning';
    }
  };

  const menuItems = [
    {
      key: 'view',
      label: 'View Details',
      icon: <FaEye />,
      onClick: () => onView(gym.id),
    },
    {
      key: 'edit',
      label: 'Edit Gym',
      icon: <FaEdit />,
      onClick: () => onEdit(gym.id),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Delete Gym',
      icon: <FaTrash />,
      danger: true,
      onClick: () => onDelete(gym.id),
    },
  ];

  return (
    <Card
      hoverable
      className="admin-gym-card"
      styles={{
        body: { padding: '20px' }
      }}
      actions={showActions ? [
        <Button 
          key="view"
          type="text" 
          icon={<FaEye />}
          onClick={() => onView(gym.id)}
        >
          View
        </Button>,
        <Button 
          key="edit"
          type="text" 
          icon={<FaEdit />}
          onClick={() => onEdit(gym.id)}
        >
          Edit
        </Button>,
        <Dropdown 
          key="more"
          menu={{ items: menuItems }} 
          trigger={['click']}
        >
          <Button type="text" icon={<FaEllipsisV />} />
        </Dropdown>,
      ] : []}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <Title level={4} style={{ margin: 0, marginRight: '8px' }}>
              {gym.name}
            </Title>
            {gym.featured && <FaCrown style={{ color: '#faad14' }} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#8c8c8c', fontSize: '13px' }}>
            <FaMapMarkerAlt style={{ marginRight: '4px' }} />
            <Text style={{ color: '#8c8c8c' }}>{gym.location}</Text>
          </div>
        </div>
        
        <img 
          src={gym.image} 
          alt={gym.name}
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '8px', 
            objectFit: 'cover',
            border: '2px solid #f0f0f0'
          }}
        />
      </div>

      {/* Status Tags */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <Tag color={getStatusColor(gym.subscriptionStatus)}>
          {gym.subscriptionStatus.toUpperCase()}
        </Tag>
        <Tag color={getPaymentColor(gym.paymentStatus)}>
          Payment: {gym.paymentStatus.toUpperCase()}
        </Tag>
        {gym.paymentStatus === 'overdue' && (
          <Tag color="error" icon={<FaExclamationTriangle />}>
            ACTION REQUIRED
          </Tag>
        )}
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#4CAF50' }}>
            {gym.branches.length}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            Branches
          </div>
          <div style={{ fontSize: '11px', color: '#52c41a' }}>
            ({activeBranches} active)
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#52c41a' }}>
            {totalStaff}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            Staff Members
          </div>
        </div>
      </div>

      {/* Branch Progress */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Branch Activity</Text>
          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {activeBranches}/{gym.branches.length}
          </Text>
        </div>
        <Progress 
          percent={Math.round((activeBranches / gym.branches.length) * 100)} 
          size="small"
          strokeColor="#52c41a"
          trailColor="#f0f0f0"
        />
      </div>

      {/* Quick Info */}
      <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Owner ID:</span>
          <span>{gym.ownerId}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Created:</span>
          <span>{new Date(gym.createdAt).toLocaleDateString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Last Active:</span>
          <span>{gym.lastActive ? new Date(gym.lastActive).toLocaleDateString() : 'Never'}</span>
        </div>
      </div>

      {/* Alert for issues */}
      {gym.paymentStatus === 'overdue' && (
        <div style={{ 
          padding: '8px 12px',
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '6px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaExclamationTriangle style={{ color: '#ff4d4f', fontSize: '12px' }} />
            <Text style={{ fontSize: '12px', color: '#ff4d4f', fontWeight: '500' }}>
              Payment overdue - Action required
            </Text>
          </div>
        </div>
      )}

      {/* Description */}
      {gym.description && (
        <Text 
          style={{ 
            fontSize: '13px', 
            color: '#595959', 
            lineHeight: '1.4',
            display: 'block'
          }}
          ellipsis={{ rows: 2, tooltip: gym.description }}
        >
          {gym.description}
        </Text>
      )}
    </Card>
  );
}