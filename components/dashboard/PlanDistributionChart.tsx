'use client';

import React from 'react';
import { Card } from 'antd';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

interface PlanDistributionItem {
    name: string;
    value: number;
}

interface PlanDistributionChartProps {
    data: PlanDistributionItem[];
}

export default function PlanDistributionChart({ data }: PlanDistributionChartProps) {
    const { t } = useTranslation();

    // Custom colors for bars
    const colors = ['#00B96B', '#4e73df', '#36b9cc', '#f6c23e', '#e74a3b'];

    return (
        <Card
            title={t('dashboard.common.stats.planDistribution')}
            bordered={false}
            style={{
                width: '100%',
                height: '100%',
                boxShadow: 'var(--shadow-sm)',
                borderRadius: 'var(--radius-lg)'
            }}
        >
            <div style={{ width: '100%', height: 300 }}>
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            />
                            <Bar dataKey="value" name="Clients" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-color-secondary)' }}>
                        No data available
                    </div>
                )}
            </div>
        </Card>
    );
}
