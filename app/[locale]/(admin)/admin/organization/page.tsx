'use client';

import { useState } from 'react';
import { 
  Card, 
  Tree, 
  Button, 
  Typography, 
  Space,
  Row,
  Col,
  Statistic,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Avatar,
  Tag,
  Tabs,
  Alert,
  message,
  Tooltip,
  Divider
} from 'antd';
import { 
  FaBuilding,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaUserTie,
  FaChartLine,
  FaCog,
  FaMapMarked,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import AdminProtectedRoute from '@/components/shared/AdminProtectedRoute';
import { UserRole } from '@/lib/types';

const { Title, Text } = Typography;
const { Option } = Select;

interface Department {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
  isActive: boolean;
  budget?: number;
  location?: string;
  createdAt: string;
}

interface OrganizationEmployee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  departmentName: string;
  position: string;
  manager?: string;
  joinDate: string;
  location: string;
  phone?: string;
  isActive: boolean;
  permissions: string[];
}

interface CompanyInfo {
  name: string;
  headquarters: string;
  founded: string;
  employees: number;
  revenue: string;
  website: string;
  description: string;
  logo: string;
}

const mockCompanyInfo: CompanyInfo = {
  name: 'FitConnect Technologies',
  headquarters: 'San Francisco, CA',
  founded: '2022',
  employees: 45,
  revenue: '$2.5M ARR',
  website: 'https://fitconnect.com',
  description: 'Leading provider of comprehensive gym management solutions, serving fitness centers worldwide with innovative technology.',
  logo: '/images/fitconnect-logo.png'
};

const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Executive',
    description: 'Executive leadership and strategic direction',
    employeeCount: 3,
    isActive: true,
    location: 'San Francisco HQ',
    createdAt: '2022-01-01'
  },
  {
    id: 'dept-2',
    name: 'Engineering',
    description: 'Product development and technical operations',
    parentId: 'dept-1',
    managerId: 'emp-2',
    managerName: 'Alice Johnson',
    employeeCount: 15,
    isActive: true,
    budget: 500000,
    location: 'San Francisco HQ',
    createdAt: '2022-01-15'
  },
  {
    id: 'dept-3',
    name: 'Frontend Team',
    description: 'User interface and experience development',
    parentId: 'dept-2',
    managerId: 'emp-3',
    managerName: 'Bob Wilson',
    employeeCount: 6,
    isActive: true,
    location: 'San Francisco HQ',
    createdAt: '2022-02-01'
  },
  {
    id: 'dept-4',
    name: 'Backend Team',
    description: 'Server-side development and infrastructure',
    parentId: 'dept-2',
    managerId: 'emp-4',
    managerName: 'Carol Davis',
    employeeCount: 8,
    isActive: true,
    location: 'San Francisco HQ',
    createdAt: '2022-02-01'
  },
  {
    id: 'dept-5',
    name: 'Customer Success',
    description: 'Customer support and success management',
    parentId: 'dept-1',
    managerId: 'emp-5',
    managerName: 'David Brown',
    employeeCount: 8,
    isActive: true,
    budget: 200000,
    location: 'Remote',
    createdAt: '2022-03-01'
  },
  {
    id: 'dept-6',
    name: 'Sales & Marketing',
    description: 'Revenue generation and market expansion',
    parentId: 'dept-1',
    managerId: 'emp-6',
    managerName: 'Emma Wilson',
    employeeCount: 10,
    isActive: true,
    budget: 300000,
    location: 'New York Office',
    createdAt: '2022-04-01'
  },
  {
    id: 'dept-7',
    name: 'Operations',
    description: 'Business operations and administration',
    parentId: 'dept-1',
    managerId: 'emp-7',
    managerName: 'Frank Miller',
    employeeCount: 5,
    isActive: true,
    budget: 150000,
    location: 'San Francisco HQ',
    createdAt: '2022-05-01'
  }
];

const mockEmployees: OrganizationEmployee[] = [
  {
    id: 'emp-1',
    name: 'John Smith',
    email: 'john.smith@fitconnect.com',
    role: UserRole.FITCONNECT_ADMIN,
    departmentId: 'dept-1',
    departmentName: 'Executive',
    position: 'CEO & Founder',
    joinDate: '2022-01-01',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    isActive: true,
    permissions: ['all']
  },
  {
    id: 'emp-2',
    name: 'Alice Johnson',
    email: 'alice.johnson@fitconnect.com',
    role: UserRole.FITCONNECT_ADMIN,
    departmentId: 'dept-2',
    departmentName: 'Engineering',
    position: 'VP of Engineering',
    manager: 'John Smith',
    joinDate: '2022-01-15',
    location: 'San Francisco, CA',
    phone: '+1 (555) 234-5678',
    isActive: true,
    permissions: ['engineering', 'users', 'settings']
  },
  {
    id: 'emp-3',
    name: 'Bob Wilson',
    email: 'bob.wilson@fitconnect.com',
    role: UserRole.FITCONNECT_ADMIN,
    departmentId: 'dept-3',
    departmentName: 'Frontend Team',
    position: 'Frontend Lead',
    manager: 'Alice Johnson',
    joinDate: '2022-02-01',
    location: 'San Francisco, CA',
    isActive: true,
    permissions: ['templates', 'branding']
  },
  {
    id: 'emp-4',
    name: 'Carol Davis',
    email: 'carol.davis@fitconnect.com',
    role: UserRole.FITCONNECT_ADMIN,
    departmentId: 'dept-4',
    departmentName: 'Backend Team',
    position: 'Backend Lead',
    manager: 'Alice Johnson',
    joinDate: '2022-02-01',
    location: 'San Francisco, CA',
    isActive: true,
    permissions: ['payments', 'subscriptions', 'settings']
  },
  {
    id: 'emp-5',
    name: 'David Brown',
    email: 'david.brown@fitconnect.com',
    role: UserRole.FITCONNECT_ADMIN,
    departmentId: 'dept-5',
    departmentName: 'Customer Success',
    position: 'Customer Success Manager',
    manager: 'John Smith',
    joinDate: '2022-03-01',
    location: 'Remote',
    isActive: true,
    permissions: ['gyms', 'users', 'subscriptions']
  }
];

export default function OrganizationPage() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [employees, setEmployees] = useState<OrganizationEmployee[]>(mockEmployees);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(mockCompanyInfo);
  const [isDeptModalVisible, setIsDeptModalVisible] = useState(false);
  const [isEmpModalVisible, setIsEmpModalVisible] = useState(false);
  const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingEmp, setEditingEmp] = useState<OrganizationEmployee | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [deptForm] = Form.useForm();
  const [empForm] = Form.useForm();
  const [companyForm] = Form.useForm();

  // Build tree structure for departments
  const buildDepartmentTree = () => {
    const departmentMap = new Map();
    
    // Create nodes
    departments.forEach(dept => {
      departmentMap.set(dept.id, {
        title: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBuilding style={{ color: dept.isActive ? '#4CAF50' : '#8c8c8c' }} />
              <span style={{ fontWeight: '500' }}>{dept.name}</span>
              <Tag size="small" color={dept.isActive ? 'success' : 'default'}>
                {dept.employeeCount} employees
              </Tag>
            </div>
            <Space>
              <Button 
                type="text" 
                size="small" 
                icon={<FaEdit />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditDepartment(dept);
                }}
              />
              <Button 
                type="text" 
                size="small" 
                icon={<FaTrash />}
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDepartment(dept.id);
                }}
              />
            </Space>
          </div>
        ),
        key: dept.id,
        children: [],
        data: dept
      });
    });

    // Build hierarchy
    const rootNodes: any[] = [];
    departments.forEach(dept => {
      const node = departmentMap.get(dept.id);
      if (dept.parentId) {
        const parent = departmentMap.get(dept.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  };

  const handleAddDepartment = () => {
    setEditingDept(null);
    deptForm.resetFields();
    setIsDeptModalVisible(true);
  };

  const handleEditDepartment = (dept: Department) => {
    setEditingDept(dept);
    deptForm.setFieldsValue(dept);
    setIsDeptModalVisible(true);
  };

  const handleDeleteDepartment = (deptId: string) => {
    Modal.confirm({
      title: 'Delete Department',
      content: 'Are you sure you want to delete this department? All sub-departments and employees will need to be reassigned.',
      onOk() {
        setDepartments(prev => prev.filter(d => d.id !== deptId && d.parentId !== deptId));
        message.success('Department deleted successfully');
      },
    });
  };

  const handleSaveDepartment = async (values: any) => {
    if (editingDept) {
      setDepartments(prev => prev.map(d => 
        d.id === editingDept.id ? { ...d, ...values } : d
      ));
      message.success('Department updated successfully');
    } else {
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        ...values,
        employeeCount: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setDepartments(prev => [...prev, newDept]);
      message.success('Department created successfully');
    }
    setIsDeptModalVisible(false);
  };

  const handleAddEmployee = () => {
    setEditingEmp(null);
    empForm.resetFields();
    setIsEmpModalVisible(true);
  };

  const handleEditEmployee = (emp: OrganizationEmployee) => {
    setEditingEmp(emp);
    empForm.setFieldsValue(emp);
    setIsEmpModalVisible(true);
  };

  const handleSaveEmployee = async (values: any) => {
    if (editingEmp) {
      setEmployees(prev => prev.map(e => 
        e.id === editingEmp.id ? { ...e, ...values } : e
      ));
      message.success('Employee updated successfully');
    } else {
      const department = departments.find(d => d.id === values.departmentId);
      const newEmp: OrganizationEmployee = {
        id: `emp-${Date.now()}`,
        ...values,
        departmentName: department?.name || '',
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true,
        permissions: []
      };
      setEmployees(prev => [...prev, newEmp]);
      message.success('Employee added successfully');
    }
    setIsEmpModalVisible(false);
  };

  const employeeColumns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (emp: OrganizationEmployee) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar size={40} style={{ backgroundColor: '#4CAF50' }}>
            {emp.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <div>
            <div style={{ fontWeight: '500' }}>{emp.name}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{emp.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager: string) => manager || 'N/A',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Join Date',
      key: 'joinDate',
      render: (emp: OrganizationEmployee) => (
        <Text style={{ fontSize: '12px' }}>
          {new Date(emp.joinDate).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (emp: OrganizationEmployee) => (
        <Tag color={emp.isActive ? 'success' : 'default'}>
          {emp.isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (emp: OrganizationEmployee) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            icon={<FaEdit />}
            onClick={() => handleEditEmployee(emp)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  // Filter employees by selected department
  const filteredEmployees = selectedDepartment
    ? employees.filter(emp => emp.departmentId === selectedDepartment)
    : employees;

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <FaBuilding /> Organization Overview
        </span>
      ),
      children: (
        <div>
          {/* Company Info Card */}
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={16}>
              <Col span={18}>
                <Title level={3} style={{ margin: '0 0 16px 0' }}>
                  {companyInfo.name}
                </Title>
                <Text style={{ fontSize: '16px', color: '#595959', lineHeight: '1.6' }}>
                  {companyInfo.description}
                </Text>
                
                <Row gutter={[32, 16]} style={{ marginTop: '24px' }}>
                  <Col span={8}>
                    <Statistic
                      title="Headquarters"
                      value={companyInfo.headquarters}
                      prefix={<FaMapMarked />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Founded"
                      value={companyInfo.founded}
                      prefix={<FaCalendarAlt />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Annual Revenue"
                      value={companyInfo.revenue}
                      prefix={<FaChartLine />}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <img 
                  src={companyInfo.logo} 
                  alt="Company Logo"
                  style={{ maxWidth: '100%', maxHeight: '120px' }}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/images/placeholder-logo.png';
                  }}
                />
                <div style={{ marginTop: '16px' }}>
                  <Button 
                    icon={<FaEdit />}
                    onClick={() => {
                      companyForm.setFieldsValue(companyInfo);
                      setIsCompanyModalVisible(true);
                    }}
                  >
                    Edit Info
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Statistics */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Total Departments"
                  value={departments.length}
                  prefix={<FaBuilding style={{ color: '#4CAF50' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Total Employees"
                  value={employees.length}
                  prefix={<FaUsers style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Admin Users"
                  value={employees.filter(e => e.role === UserRole.FITCONNECT_ADMIN).length}
                  prefix={<FaUserTie style={{ color: '#722ed1' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Active Employees"
                  value={employees.filter(e => e.isActive).length}
                  prefix={<FaUsers style={{ color: '#52c41a' }} />}
                  suffix={`/ ${employees.length}`}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'structure',
      label: (
        <span>
          <FaChartLine /> Department Structure
        </span>
      ),
      children: (
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Card 
                title="Department Hierarchy"
                extra={
                  <Button 
                    type="primary"
                    icon={<FaPlus />}
                    onClick={handleAddDepartment}
                  >
                    Add Department
                  </Button>
                }
              >
                <Tree
                  showLine
                  defaultExpandAll
                  treeData={buildDepartmentTree()}
                  onSelect={(keys) => {
                    setSelectedDepartment(keys[0] as string || null);
                  }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title={selectedDepartment ? "Department Details" : "Select Department"}>
                {selectedDepartment ? (
                  (() => {
                    const dept = departments.find(d => d.id === selectedDepartment);
                    return dept ? (
                      <div>
                        <Title level={4}>{dept.name}</Title>
                        <Text style={{ color: '#8c8c8c' }}>{dept.description}</Text>
                        
                        <Divider />
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <div style={{ marginBottom: '12px' }}>
                              <Text strong>Manager:</Text><br />
                              <Text>{dept.managerName || 'Not assigned'}</Text>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ marginBottom: '12px' }}>
                              <Text strong>Employees:</Text><br />
                              <Text>{dept.employeeCount}</Text>
                            </div>
                          </Col>
                        </Row>
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <div style={{ marginBottom: '12px' }}>
                              <Text strong>Location:</Text><br />
                              <Text>{dept.location || 'Not specified'}</Text>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ marginBottom: '12px' }}>
                              <Text strong>Budget:</Text><br />
                              <Text>{dept.budget ? `$${dept.budget.toLocaleString()}` : 'Not set'}</Text>
                            </div>
                          </Col>
                        </Row>
                        
                        <Divider />
                        
                        <Space>
                          <Button icon={<FaEdit />} onClick={() => handleEditDepartment(dept)}>
                            Edit Department
                          </Button>
                          <Button 
                            icon={<FaUsers />}
                            onClick={() => {
                              // Switch to employees tab with department filter
                            }}
                          >
                            View Employees
                          </Button>
                        </Space>
                      </div>
                    ) : null;
                  })()
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#8c8c8c' }}>
                    <FaBuilding style={{ fontSize: '48px', marginBottom: '16px' }} />
                    <div>Select a department from the tree to view details</div>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'employees',
      label: (
        <span>
          <FaUsers /> Employees
        </span>
      ),
      children: (
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Select
                style={{ width: 200 }}
                placeholder="Filter by department"
                allowClear
                value={selectedDepartment}
                onChange={setSelectedDepartment}
              >
                {departments.map(dept => (
                  <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                ))}
              </Select>
            </div>
            
            <Button 
              type="primary"
              icon={<FaPlus />}
              onClick={handleAddEmployee}
            >
              Add Employee
            </Button>
          </div>

          <Table
            columns={employeeColumns}
            dataSource={filteredEmployees}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminProtectedRoute requiredPermission={{ resource: 'organization', action: 'read' }}>
      <div>
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaBuilding />
              </span>
              Organization Management
            </h1>
            <p className="dashboard-page-subtitle">Manage FitConnect's organizational structure, departments, and team members</p>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <Tabs 
            defaultActiveKey="overview"
            items={tabItems}
            size="large"
          />
        </Card>

        {/* Department Modal */}
        <Modal
          title={editingDept ? 'Edit Department' : 'Add Department'}
          open={isDeptModalVisible}
          onCancel={() => setIsDeptModalVisible(false)}
          onOk={() => deptForm.submit()}
        >
          <Form
            form={deptForm}
            layout="vertical"
            onFinish={handleSaveDepartment}
          >
            <Form.Item
              name="name"
              label="Department Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="parentId"
                  label="Parent Department"
                >
                  <Select placeholder="Select parent (optional)">
                    {departments.map(dept => (
                      <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Location"
                >
                  <Input placeholder="e.g., San Francisco HQ" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="budget"
              label="Annual Budget (USD)"
            >
              <Input type="number" placeholder="0" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Employee Modal */}
        <Modal
          title={editingEmp ? 'Edit Employee' : 'Add Employee'}
          open={isEmpModalVisible}
          onCancel={() => setIsEmpModalVisible(false)}
          onOk={() => empForm.submit()}
          width={600}
        >
          <Form
            form={empForm}
            layout="vertical"
            onFinish={handleSaveEmployee}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="Position"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="departmentId"
                  label="Department"
                  rules={[{ required: true }]}
                >
                  <Select>
                    {departments.map(dept => (
                      <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Location"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g., San Francisco, CA" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone"
                >
                  <Input placeholder="+1 (555) 123-4567" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="manager"
              label="Manager"
            >
              <Select placeholder="Select manager (optional)">
                {employees.map(emp => (
                  <Option key={emp.id} value={emp.name}>{emp.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Company Info Modal */}
        <Modal
          title="Edit Company Information"
          open={isCompanyModalVisible}
          onCancel={() => setIsCompanyModalVisible(false)}
          onOk={() => companyForm.submit()}
          width={600}
        >
          <Form
            form={companyForm}
            layout="vertical"
            onFinish={(values) => {
              setCompanyInfo(values);
              setIsCompanyModalVisible(false);
              message.success('Company information updated');
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name" label="Company Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="website" label="Website" rules={[{ type: 'url' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="headquarters" label="Headquarters" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="founded" label="Founded" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={4} />
            </Form.Item>
            
            <Form.Item name="logo" label="Logo URL">
              <Input placeholder="https://..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminProtectedRoute>
  );
}