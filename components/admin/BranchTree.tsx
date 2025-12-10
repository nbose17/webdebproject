'use client';

import { Tree, Typography, Tag, Button } from 'antd';
import { 
  FaBuilding, 
  FaUsers, 
  FaUserTie, 
  FaEye,
  FaChevronRight,
  FaChevronDown
} from 'react-icons/fa';
import type { AdminGym, Branch } from '@/lib/types';

const { Text } = Typography;

interface BranchTreeProps {
  gym: AdminGym;
  branches: Branch[];
  onBranchSelect?: (branchId: string) => void;
  onUserSelect?: (userId: string, branchId: string) => void;
}

export default function BranchTree({ 
  gym, 
  branches, 
  onBranchSelect,
  onUserSelect 
}: BranchTreeProps) {

  // Transform branches into tree structure
  const treeData = [
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaBuilding style={{ color: '#4CAF50' }} />
          <span style={{ fontWeight: '600' }}>{gym.name}</span>
          <Tag color="blue" size="small">Gym</Tag>
        </div>
      ),
      key: gym.id,
      icon: <FaBuilding style={{ color: '#4CAF50' }} />,
      children: branches.map(branch => ({
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '500' }}>{branch.name}</span>
                <Tag 
                  color={branch.status === 'active' ? 'success' : 'error'} 
                  size="small"
                >
                  {branch.status}
                </Tag>
              </div>
              <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '2px' }}>
                {branch.staff.length} staff, {branch.clients.length} clients
              </div>
            </div>
            <Button 
              type="text" 
              size="small" 
              icon={<FaEye />}
              onClick={(e) => {
                e.stopPropagation();
                onBranchSelect?.(branch.id);
              }}
            />
          </div>
        ),
        key: branch.id,
        icon: <FaBuilding style={{ color: branch.status === 'active' ? '#52c41a' : '#ff4d4f' }} />,
        children: [
          // Staff section
          {
            title: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaUsers style={{ color: '#722ed1' }} />
                <span style={{ fontWeight: '500' }}>Staff ({branch.staff.length})</span>
              </div>
            ),
            key: `${branch.id}-staff`,
            icon: <FaUsers style={{ color: '#722ed1' }} />,
            selectable: false,
            children: branch.staff.map(staff => ({
              title: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px' }}>{staff.name}</span>
                      <Tag 
                        color={staff.isActive ? 'success' : 'default'} 
                        size="small"
                      >
                        {staff.role.replace('gym_', '').replace('_', ' ')}
                      </Tag>
                    </div>
                    <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                      {staff.email}
                    </div>
                  </div>
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<FaEye />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUserSelect?.(staff.id, branch.id);
                    }}
                  />
                </div>
              ),
              key: `${branch.id}-staff-${staff.id}`,
              icon: <FaUserTie style={{ 
                color: staff.role === 'gym_manager' ? '#fa8c16' : 
                       staff.role === 'gym_trainer' ? '#52c41a' : '#8c8c8c' 
              }} />,
              isLeaf: true,
            })),
          },
          // Clients section  
          {
            title: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaUsers style={{ color: '#13c2c2' }} />
                <span style={{ fontWeight: '500' }}>Clients ({branch.clients.length})</span>
              </div>
            ),
            key: `${branch.id}-clients`,
            icon: <FaUsers style={{ color: '#13c2c2' }} />,
            selectable: false,
            children: branch.clients.slice(0, 5).map(client => ({
              title: (
                <div style={{ fontSize: '13px' }}>
                  <div>{client.name}</div>
                  <div style={{ fontSize: '11px', color: '#8c8c8c' }}>
                    {client.membershipType} • {client.status}
                  </div>
                </div>
              ),
              key: `${branch.id}-client-${client.id}`,
              icon: <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: client.status === 'active' ? '#52c41a' : '#ff4d4f'
              }} />,
              isLeaf: true,
            })).concat(
              branch.clients.length > 5 ? [{
                title: (
                  <Text style={{ fontSize: '12px', color: '#8c8c8c', fontStyle: 'italic' }}>
                    ... and {branch.clients.length - 5} more clients
                  </Text>
                ),
                key: `${branch.id}-clients-more`,
                icon: <div style={{ width: '12px', height: '2px', backgroundColor: '#d9d9d9' }} />,
                isLeaf: true,
                selectable: false,
              }] : []
            ),
          },
        ],
      })),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
          Click on branch or user names to view details
        </Text>
      </div>
      
      <Tree
        showIcon
        defaultExpandAll
        treeData={treeData}
        style={{ 
          background: 'transparent',
          fontSize: '14px'
        }}
        switcherIcon={({ expanded }) => 
          expanded ? 
            <FaChevronDown style={{ fontSize: '10px', color: '#8c8c8c' }} /> : 
            <FaChevronRight style={{ fontSize: '10px', color: '#8c8c8c' }} />
        }
      />
    </div>
  );
}