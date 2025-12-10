'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Client } from '@/lib/types';
import { mockClients } from '@/lib/constants';
import Button from '@/components/shared/Button';
import { FaUsers, FaArrowLeft, FaEnvelope, FaPhone, FaCreditCard, FaCalendarAlt, FaFileContract, FaWhatsapp, FaTelegram, FaPaperPlane } from 'react-icons/fa';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ClientDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const routeParams = useParams();
  const locale = routeParams.locale as string;
  const [isSending, setIsSending] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'whatsapp' | 'telegram' | null>(null);

  const client = mockClients.find((c) => c.id === id);

  if (!client) {
    return (
      <div>
        <div className="dashboard-page-header">
          <h1 className="dashboard-page-title">Client Not Found</h1>
        </div>
        <Button variant="outline" onClick={() => router.push(`/${locale}/dashboard/clients`)}>
          Back to Clients
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateDaysRemaining = (endDate?: string) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining(client.subscriptionEndDate);
  const shouldShowRenewalNotification = daysRemaining !== null && daysRemaining <= 15;

  const handleSendNotification = async (channel: 'email' | 'whatsapp' | 'telegram') => {
    setIsSending(true);
    setSelectedChannel(channel);

    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setSelectedChannel(null);
      alert(`Renewal notification sent via ${channel.charAt(0).toUpperCase() + channel.slice(1)}!`);
    }, 1500);
  };

  const getContractContent = () => {
    return `
CLIENT MEMBERSHIP CONTRACT

Client Information:
Name: ${client.name}
Email: ${client.email}
Phone: ${client.phone}
Membership Type: ${client.membershipType}
Join Date: ${formatDate(client.joinDate)}
Status: ${client.status.charAt(0).toUpperCase() + client.status.slice(1)}
Client ID: ${client.id}

Contract Details:
${client.contractStartDate ? `Contract Start Date: ${formatDate(client.contractStartDate)}` : ''}
${client.contractEndDate ? `Contract End Date: ${formatDate(client.contractEndDate)}` : ''}
${client.subscriptionEndDate ? `Subscription End Date: ${formatDate(client.subscriptionEndDate)}` : ''}

Terms and Conditions:
1. This membership is valid for the duration specified in the membership type.
2. The client agrees to follow all gym rules and regulations.
3. Membership fees are non-refundable.
4. The gym reserves the right to suspend or cancel membership for violations.

Generated on: ${new Date().toLocaleDateString()}
    `.trim();
  };

  const handleDownloadContract = () => {
    const contractContent = getContractContent();
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

  const handleSendContract = (channel: 'email' | 'whatsapp' | 'telegram') => {
    const contractContent = getContractContent();
    const subject = `Membership Contract - ${client.name}`;
    const fileName = `${client.name.replace(/\s+/g, '-')}-contract.txt`;

    if (channel === 'email') {
      // Create mailto link with contract content in body
      const mailtoBody = encodeURIComponent(contractContent);
      const mailtoSubject = encodeURIComponent(subject);
      window.location.href = `mailto:${client.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
    } else if (channel === 'whatsapp') {
      // Create WhatsApp share link
      const message = encodeURIComponent(`*${subject}*\n\n${contractContent}`);
      const whatsappUrl = `https://wa.me/?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } else if (channel === 'telegram') {
      // Create Telegram share link
      const message = encodeURIComponent(`*${subject}*\n\n${contractContent}`);
      const telegramUrl = `https://t.me/share/url?text=${message}`;
      window.open(telegramUrl, '_blank');
    }
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/${locale}/dashboard/clients`)}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
          >
            <FaArrowLeft />
            Back
          </Button>
          <div>
            <h1 className="dashboard-page-title">
              <span className="dashboard-page-title-icon">
                <FaUsers />
              </span>
              Client Details
            </h1>
            <p className="dashboard-page-subtitle">View and manage client information</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
        {/* Client Information and Subscription Cards Row */}
        <div style={{ display: 'flex', gap: 'var(--spacing-2xl)', flexWrap: 'wrap' }}>
          {/* Client Information Card */}
          <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', flex: '1', minWidth: '400px' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-lg)' }}>Client Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {client.image && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
                  <img
                    src={client.image}
                    alt={client.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--color-border)',
                    }}
                  />
                </div>
              )}
              <div>
                <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-xs)', textAlign: 'center' }}>
                  {client.name}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
                  <span style={{
                    padding: 'var(--spacing-xs) var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    background: client.status === 'active' ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
                    color: client.status === 'active' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    display: 'inline-block'
                  }}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <FaEnvelope style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)' }}>{client.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <FaPhone style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)' }}>{client.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <FaCreditCard style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)' }}>{client.membershipType}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <FaCalendarAlt style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)' }}>
                    Joined: {formatDate(client.joinDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription & Contract Details Card */}
          <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', flex: '1', minWidth: '400px' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-lg)' }}>Subscription & Contract</h2>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-sm)' }}>
              Contract Actions
            </label>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadContract} 
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
              >
                <FaFileContract />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSendContract('email')} 
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
              >
                <FaEnvelope />
                Send Email
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSendContract('whatsapp')} 
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
              >
                <FaWhatsapp style={{ color: '#25D366' }} />
                Send WhatsApp
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSendContract('telegram')} 
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
              >
                <FaTelegram style={{ color: '#0088cc' }} />
                Send Telegram
              </Button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)' }}>
            <div>
              <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                Subscription End Date
              </label>
              <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                {client.subscriptionEndDate ? formatDate(client.subscriptionEndDate) : 'Not set'}
              </p>
              {daysRemaining !== null && (
                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: daysRemaining <= 15 ? '#dc3545' : daysRemaining <= 30 ? '#ffc107' : 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : daysRemaining === 0 ? 'Expires today' : 'Expired'}
                </p>
              )}
            </div>
            <div>
              <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                Contract Start Date
              </label>
              <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                {client.contractStartDate ? formatDate(client.contractStartDate) : 'Not set'}
              </p>
            </div>
            <div>
              <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                Contract End Date
              </label>
              <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                {client.contractEndDate ? formatDate(client.contractEndDate) : 'Not set'}
              </p>
            </div>
          </div>
          </div>
        </div>

        {/* Renewal Notification Section */}
        {shouldShowRenewalNotification && (
          <div style={{ background: 'var(--color-white)', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-xs)' }}>
                Renewal Reminder
              </h2>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                {daysRemaining !== null && daysRemaining > 0 
                  ? `Send renewal notification to ${client.name}. Subscription expires in ${daysRemaining} days.`
                  : daysRemaining === 0
                  ? `Send renewal notification to ${client.name}. Subscription expires today.`
                  : `Send renewal notification to ${client.name}. Subscription has expired ${Math.abs(daysRemaining)} days ago.`
                }
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                onClick={() => handleSendNotification('email')}
                disabled={isSending}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flex: 1, minWidth: '200px' }}
              >
                <FaEnvelope />
                {isSending && selectedChannel === 'email' ? 'Sending...' : 'Send Email'}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSendNotification('whatsapp')}
                disabled={isSending}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flex: 1, minWidth: '200px' }}
              >
                <FaWhatsapp style={{ color: '#25D366' }} />
                {isSending && selectedChannel === 'whatsapp' ? 'Sending...' : 'Send WhatsApp'}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSendNotification('telegram')}
                disabled={isSending}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flex: 1, minWidth: '200px' }}
              >
                <FaTelegram style={{ color: '#0088cc' }} />
                {isSending && selectedChannel === 'telegram' ? 'Sending...' : 'Send Telegram'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

