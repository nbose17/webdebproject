'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { Select, Input as AntdInput, Skeleton, Alert, message, Modal } from 'antd';
import { Client, Plan } from '@/lib/types';
import DataTable from '@/components/dashboard/DataTable';
import ClientCard from '@/components/dashboard/ClientCard';
import ClientForm from '@/components/dashboard/ClientForm';
import Button from '@/components/shared/Button';
import { FaUsers, FaDownload, FaIdCard, FaTable, FaTh, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { GET_CLIENTS, CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT, GET_PLANS } from '@/graphql/queries/admin';

const { Search } = AntdInput;

type ViewMode = 'table' | 'card';
type SortField = 'name' | 'joinDate' | 'status' | 'membershipType';
type SortDirection = 'asc' | 'desc';

export default function ClientsPage() {
  const { user } = useAuth();
  const gymId = user?.gymId;

  const { data, loading, error, refetch } = useQuery<{ clients: Client[] }>(GET_CLIENTS, {
    variables: { gymId },
    skip: !gymId,
    fetchPolicy: 'network-only',
  });

  const { data: plansData } = useQuery<{ plans: Plan[] }>(GET_PLANS, {
    variables: { gymId },
    skip: !gymId,
  });

  const [createClient] = useMutation(CREATE_CLIENT, {
    onCompleted: () => {
      message.success('Client created successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to create client: ${error.message}`);
    },
  });

  const [updateClient] = useMutation(UPDATE_CLIENT, {
    onCompleted: () => {
      message.success('Client updated successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to update client: ${error.message}`);
    },
  });

  const [deleteClient] = useMutation(DELETE_CLIENT, {
    onCompleted: () => {
      message.success('Client deleted successfully!');
      refetch();
    },
    onError: (error) => {
      message.error(`Failed to delete client: ${error.message}`);
    },
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');



  const clients = data?.clients || [];
  const plans = plansData?.plans || [];

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [membershipTypeFilter, setMembershipTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get unique membership types
  const membershipTypes = useMemo(() => {
    const types = new Set(clients.map(c => c.membershipType));
    return Array.from(types).sort();
  }, [clients]);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = [...clients];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    // Apply membership type filter
    if (membershipTypeFilter !== 'all') {
      filtered = filtered.filter(client => client.membershipType === membershipTypeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate).getTime();
          bValue = new Date(b.joinDate).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'membershipType':
          aValue = a.membershipType.toLowerCase();
          bValue = b.membershipType.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, searchQuery, statusFilter, membershipTypeFilter, sortField, sortDirection]);

  const handleDownloadContract = (client: Client) => {
    // Create contract content
    const contractContent = `
CLIENT MEMBERSHIP CONTRACT

Client Information:
Name: ${client.name}
Email: ${client.email}
Phone: ${client.phone}
Membership Type: ${client.membershipType}
Join Date: ${formatDate(client.joinDate)}
Status: ${client.status.charAt(0).toUpperCase() + client.status.slice(1)}
Client ID: ${client.id}

Terms and Conditions:
1. This membership is valid for the duration specified in the membership type.
2. The client agrees to follow all gym rules and regulations.
3. Membership fees are non-refundable.
4. The gym reserves the right to suspend or cancel membership for violations.

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    // Create and download text file
    const blob = new Blob([contractContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${client.name.replace(/\s+/g, '-')}-contract.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadIDCard = (client: Client) => {
    // Create client data for QR code
    const clientData = JSON.stringify({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      membershipType: client.membershipType,
      joinDate: client.joinDate,
      status: client.status,
    });

    // Create a temporary container for QR code rendering
    const qrContainer = document.createElement('div');
    qrContainer.style.position = 'absolute';
    qrContainer.style.left = '-9999px';
    qrContainer.style.width = '200px';
    qrContainer.style.height = '200px';
    document.body.appendChild(qrContainer);

    // Create canvas for ID card
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      document.body.removeChild(qrContainer);
      return;
    }

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

    // Title
    ctx.fillStyle = '#2D2D2D';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CLIENT ID CARD', canvas.width / 2, 50);

    // Client Information
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Name: ${client.name}`, 50, 120);
    ctx.fillText(`ID: ${client.id}`, 50, 160);
    ctx.fillText(`Membership: ${client.membershipType}`, 50, 200);
    ctx.fillText(`Status: ${client.status.toUpperCase()}`, 50, 240);

    // Generate QR code using external API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(clientData)}`;

    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.onload = () => {
      // Draw QR code on canvas
      ctx.drawImage(qrImg, canvas.width - 250, 100, 200, 200);

      // QR Code label
      ctx.fillStyle = '#666666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Scan to validate', canvas.width - 150, 320);

      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${client.name.replace(/\s+/g, '-')}-id-card.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        }
        document.body.removeChild(qrContainer);
      }, 'image/png');
    };
    qrImg.onerror = () => {
      document.body.removeChild(qrContainer);
      alert('Error generating QR code. Please try again.');
    };
    qrImg.src = qrCodeUrl;
  };

  const columns = [
    { key: 'id', label: 'No', render: (_: any, row: any, index?: number) => (index ?? 0) + 1 },
    {
      key: 'image',
      label: 'Image',
      render: (value: string) => (
        value ? (
          <img
            src={value}
            alt="Client"
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : (
          <span style={{ color: 'var(--color-text-secondary)' }}>No image</span>
        )
      )
    },
    {
      key: 'name',
      label: 'Name',
      render: (value: string, row: Client) => (
        <Link
          href={`/dashboard/clients/${row.id}`}
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 'var(--font-weight-medium)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {value}
        </Link>
      )
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'membershipType', label: 'Membership Type' },
    {
      key: 'joinDate',
      label: 'Join Date',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span style={{
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-xs)',
          fontWeight: 'var(--font-weight-semibold)',
          background: value === 'active' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
          color: value === 'active' ? 'var(--color-primary)' : 'var(--color-text-secondary)'
        }}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'downloads',
      label: 'Downloads',
      render: (_: any, row: Client) => (
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
          <button
            onClick={() => handleDownloadContract(row)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-primary)',
              transition: 'all var(--transition-base)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Download Contract"
          >
            <FaDownload />
            <span>Contract</span>
          </button>
          <button
            onClick={() => handleDownloadIDCard(row)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-primary)',
              transition: 'all var(--transition-base)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Download ID Card"
          >
            <FaIdCard />
            <span>ID Card</span>
          </button>
        </div>
      )
    },
  ];

  const handleAdd = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = (client: Client) => {
    if (!gymId) return;

    Modal.confirm({
      title: 'Delete Client',
      content: `Are you sure you want to delete "${client.name}"? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteClient({
            variables: {
              id: client.id,
              gymId,
            },
          });
        } catch (error) {
          console.error('Delete failed:', error);
        }
      },
    });
  };

  const handleSubmit = async (clientData: Omit<Client, 'id'>) => {
    if (!gymId) return;

    // Prepare variables with proper date handling
    const variables: any = {
      gymId,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      membershipType: clientData.membershipType,
      status: clientData.status,
      image: clientData.image,
      joinDate: clientData.joinDate,
      subscriptionEndDate: clientData.subscriptionEndDate,
      contractStartDate: clientData.contractStartDate,
      contractEndDate: clientData.contractEndDate,
    };

    if (editingClient) {
      variables.id = editingClient.id;
      await updateClient({ variables });
    } else {
      await createClient({ variables });
    }
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const handleRenew = async (client: Client) => {
    if (!gymId) return;

    // Find the plan corresponding to the client's membership type
    const plan = plans.find((p: any) => p.name === client.membershipType);

    if (!plan) {
      message.error(`Cannot renew: Plan "${client.membershipType}" not found.`);
      return;
    }

    // Determine the start date for renewal (either current subscription end date or today if expired)
    let startDate = new Date();
    if (client.subscriptionEndDate) {
      const currentEndDate = new Date(client.subscriptionEndDate);
      if (currentEndDate > new Date()) {
        startDate = currentEndDate;
      }
    }

    // Calculate new end date
    const newEndDate = new Date(startDate);
    newEndDate.setMonth(newEndDate.getMonth() + plan.durationMonths);

    // Update client
    await updateClient({
      variables: {
        id: client.id,
        gymId,
        subscriptionEndDate: newEndDate.toISOString().split('T')[0],
      },
      onCompleted: () => {
        message.success(`Membership renewed until ${newEndDate.toLocaleDateString()}`);
      },
      onError: (err) => {
        message.error(`Renewal failed: ${err.message}`);
      }
    });

  };

  if (!gymId) {
    return (
      <div>
        <Alert
          message="No Gym Associated"
          description="You need to be associated with a gym to manage clients."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <div className="dashboard-page-header">
          <h1 className="dashboard-page-title">
            <span className="dashboard-page-title-icon">
              <FaUsers />
            </span>
            Clients
          </h1>
        </div>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert
          message="Error Loading Clients"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">
          <span className="dashboard-page-title-icon">
            <FaUsers />
          </span>
          Clients
        </h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)', backgroundColor: 'var(--color-bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: viewMode === 'table' ? 'var(--color-white)' : 'transparent',
                color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: viewMode === 'table' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                transition: 'all var(--transition-base)',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <FaTable />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              style={{
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: viewMode === 'card' ? 'var(--color-white)' : 'transparent',
                color: viewMode === 'card' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: viewMode === 'card' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                transition: 'all var(--transition-base)',
                boxShadow: viewMode === 'card' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <FaTh />
              <span>Card</span>
            </button>
          </div>
          <Button variant="primary" onClick={handleAdd}>
            Add Client
          </Button>
        </div>
      </div>

      {/* Toolbar for Sort and Filter */}
      <div style={{
        background: 'var(--color-white)',
        padding: 'var(--spacing-lg)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', alignItems: 'flex-end' }}>
          {/* Search Input */}
          <div style={{ flex: '1', minWidth: '250px' }}>
            <Search
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ width: '100%' }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '150px' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              <FaFilter style={{ display: 'inline', marginRight: 'var(--spacing-xs)' }} />
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}
              style={{ width: '100%' }}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
            />
          </div>

          {/* Membership Type Filter */}
          <div style={{ minWidth: '150px' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Membership
            </label>
            <Select
              value={membershipTypeFilter}
              onChange={(value) => setMembershipTypeFilter(value)}
              style={{ width: '100%' }}
              options={[
                { label: 'All Types', value: 'all' },
                ...membershipTypes.map(type => ({ label: type, value: type }))
              ]}
            />
          </div>

          {/* Sort Field */}
          <div style={{ minWidth: '150px' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              <FaSort style={{ display: 'inline', marginRight: 'var(--spacing-xs)' }} />
              Sort By
            </label>
            <Select
              value={sortField}
              onChange={(value) => setSortField(value as SortField)}
              style={{ width: '100%' }}
              options={[
                { label: 'Name', value: 'name' },
                { label: 'Join Date', value: 'joinDate' },
                { label: 'Status', value: 'status' },
                { label: 'Membership Type', value: 'membershipType' },
              ]}
            />
          </div>

          {/* Sort Direction */}
          <div style={{ minWidth: '120px' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-xs)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Order
            </label>
            <Select
              value={sortDirection}
              onChange={(value) => setSortDirection(value as SortDirection)}
              style={{ width: '100%' }}
              options={[
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ]}
            />
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || statusFilter !== 'all' || membershipTypeFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setMembershipTypeFilter('all');
              }}
              style={{ alignSelf: 'flex-end' }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredAndSortedClients}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="dashboard-trainer-cards-grid">
          {filteredAndSortedClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownloadContract={handleDownloadContract}
              onDownloadIDCard={handleDownloadIDCard}
              onRenew={handleRenew}
              plans={plans}
            />
          ))}
        </div>
      )}
      {filteredAndSortedClients.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--spacing-2xl)',
          color: 'var(--color-text-secondary)',
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-sm)' }}>No clients found</p>
          <p style={{ fontSize: 'var(--font-size-sm)' }}>Try adjusting your filters or search query</p>
        </div>
      )}
      <ClientForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleSubmit}
        client={editingClient}
      />
    </div>
  );
}

