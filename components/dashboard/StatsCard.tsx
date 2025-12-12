'use client';

import React from 'react';
import { Card } from 'antd';
import { IconType } from 'react-icons';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: IconType;
    color?: string;
}

export default function StatsCard({ title, value, icon: Icon, color = 'var(--primary-color)' }: StatsCardProps) {
    return (
        <Card
            bordered={false}
            style={{
                height: '100%',
                boxShadow: 'var(--shadow-sm)',
                borderRadius: 'var(--radius-lg)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <p style={{
                        margin: 0,
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-color-secondary)',
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        {title}
                    </p>
                    <h3 style={{
                        margin: 0,
                        fontSize: 'var(--font-size-xxl)',
                        fontWeight: 700,
                        color: 'var(--text-color-primary)'
                    }}>
                        {value}
                    </h3>
                </div>
                <div style={{
                    backgroundColor: `${color}20`, // 20% opacity
                    padding: 'var(--spacing-md)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color
                }}>
                    <Icon size={24} />
                </div>
            </div>
        </Card>
    );
}
