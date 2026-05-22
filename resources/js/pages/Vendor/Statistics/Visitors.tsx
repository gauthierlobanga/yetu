/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Users,
    Eye,
    Clock,
    Percent,
    TrendingUp,
    Smartphone,
    Monitor,
    Tablet,
    Globe,
    Activity,
    ArrowUpRight,
    Sparkles,
    BarChart3,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { FaChrome, FaEdge, FaFirefox, FaSafari } from 'react-icons/fa';

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from 'recharts';

import { SiteHeader } from '@/components/site-header';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VendorSidebar } from '@/components/VendorSidebar';
import { cn } from '@/lib/utils';

import type { VendorVisitorStatsProps } from '@/types/tenants/statistics/visitors';

export default function VendorVisitorStats({
    total_visits,
    unique_visitors,
    avg_duration,
    bounce_rate,
    top_pages,
    devices,
    browsers,
    daily,
    tenant,
}: VendorVisitorStatsProps) {
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

    const stats = [
        {
            title: 'Visites totales',
            value: total_visits?.toLocaleString() ?? '0',
            icon: Eye,
            growth: '+12.4%',
            color: 'from-emerald-500 to-teal-500',
        },
        {
            title: 'Visiteurs uniques',
            value: unique_visitors?.toLocaleString() ?? '0',
            icon: Users,
            growth: '+8.2%',
            color: 'from-cyan-500 to-blue-500',
        },
        {
            title: 'Durée moyenne',
            value: formatDuration(avg_duration),
            icon: Clock,
            growth: '+4.8%',
            color: 'from-violet-500 to-fuchsia-500',
        },
        {
            title: 'Taux de rebond',
            value: `${bounce_rate}%`,
            icon: Percent,
            growth: '-2.1%',
            color: 'from-orange-500 to-red-500',
        },
    ];

    const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#8b5cf6', '#f59e0b'];

    function formatDuration(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const getDeviceIcon = (device: string) => {
        if (device.toLowerCase().includes('mobile')) {
            return <Smartphone className="h-4 w-4" />;
        }

        if (device.toLowerCase().includes('tablet')) {
            return <Tablet className="h-4 w-4" />;
        }

        return <Monitor className="h-4 w-4" />;
    };

    const getBrowserIcon = (browser: string) => {
        const b = browser.toLowerCase();

        if (b.includes('chrome')) {
            return <FaChrome className="h-4 w-4" />;
        }

        if (b.includes('firefox')) {
            return <FaFirefox className="h-4 w-4" />;
        }

        if (b.includes('edge')) {
            return <FaEdge className="h-4 w-4" />;
        }

        if (b.includes('safari')) {
            return <FaSafari className="h-4 w-4" />;
        }

        return <Globe className="h-4 w-4" />;
    };

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head
                title={`Statistiques des visiteurs - ${tenant.raison_sociale}`}
            />

            <VendorSidebar tenant={tenant} />

            <SidebarInset>
                <SiteHeader />

                <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#020617]">
                    {/* Glow Background */}
                    <div className="absolute top-0 left-0 h-125 w-125 rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute right-0 bottom-0 h-125 w-125 rounded-full bg-cyan-500/10 blur-[120px]" />

                    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {/* HERO */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="relative mb-10 overflow-hidden rounded-[32px] border border-white/20 bg-white/70 p-8 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%)]" />

                            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Dashboard Premium Analytics
                                    </div>

                                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                        Vue d’ensemble analytique
                                    </h1>

                                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                                        Analyse avancée des visiteurs, du
                                        trafic, des performances et du
                                        comportement des utilisateurs sur votre
                                        boutique.
                                    </p>
                                </div>

                                <Tabs
                                    value={period}
                                    onValueChange={(v) => setPeriod(v as any)}
                                >
                                    <TabsList className="h-12 rounded-2xl border border-slate-200/70 bg-white/70 p-1 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
                                        <TabsTrigger
                                            value="week"
                                            className="rounded-xl"
                                        >
                                            7 jours
                                        </TabsTrigger>

                                        <TabsTrigger
                                            value="month"
                                            className="rounded-xl"
                                        >
                                            30 jours
                                        </TabsTrigger>

                                        <TabsTrigger
                                            value="year"
                                            className="rounded-xl"
                                        >
                                            12 mois
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </motion.div>

                        {/* KPI */}
                        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;

                                return (
                                    <motion.div
                                        key={stat.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: index * 0.08,
                                        }}
                                    >
                                        <Card className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white/70 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/70">
                                            <div
                                                className={cn(
                                                    'absolute inset-0 bg-linear-to-br opacity-5 transition-opacity group-hover:opacity-10',
                                                    stat.color,
                                                )}
                                            />

                                            <div
                                                className={cn(
                                                    'absolute -top-10 right-0 h-32 w-32 rounded-full blur-3xl transition-all duration-500',
                                                    stat.color,
                                                )}
                                            />

                                            <CardContent className="relative p-6">
                                                <div className="mb-6 flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                            {stat.title}
                                                        </p>

                                                        <h3 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                                            {stat.value}
                                                        </h3>
                                                    </div>

                                                    <div
                                                        className={cn(
                                                            'flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg',
                                                            stat.color,
                                                        )}
                                                    >
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                        {stat.growth}
                                                    </div>

                                                    <span className="text-xs text-slate-500">
                                                        vs mois précédent
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* MINI STATS */}
                        <div className="mb-8 grid gap-6 lg:grid-cols-3">
                            <Card className="rounded-[30px] border-0 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-white/70">
                                                Croissance trafic
                                            </p>

                                            <div className="mt-4 flex items-end gap-2">
                                                <span className="text-5xl font-black">
                                                    +28%
                                                </span>
                                            </div>
                                        </div>

                                        <TrendingUp className="h-12 w-12 text-white/80" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[30px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Utilisateurs actifs
                                            </p>

                                            <h3 className="mt-4 text-5xl font-black text-slate-900 dark:text-white">
                                                1.2K
                                            </h3>
                                        </div>

                                        <Activity className="h-12 w-12 text-emerald-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[30px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Conversion estimée
                                            </p>

                                            <h3 className="mt-4 text-5xl font-black text-slate-900 dark:text-white">
                                                6.4%
                                            </h3>
                                        </div>

                                        <Zap className="h-12 w-12 text-yellow-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CHART */}
                        <Card className="mb-8 overflow-hidden rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                            <div className="border-b border-slate-200/50 p-6 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
                                        <BarChart3 className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Évolution des visites
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            Tendances des visiteurs et sessions
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart data={daily}>
                                        <defs>
                                            <linearGradient
                                                id="colorVisits"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.4}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            strokeDasharray="4 4"
                                            stroke="rgba(148,163,184,0.12)"
                                        />

                                        <XAxis
                                            dataKey="date"
                                            stroke="#94a3b8"
                                        />

                                        <YAxis stroke="#94a3b8" />

                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 20,
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                backdropFilter: 'blur(20px)',
                                            }}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="visits"
                                            stroke="#10b981"
                                            strokeWidth={4}
                                            fill="url(#colorVisits)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* GRID */}
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* TOP PAGES */}
                            <Card className="rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardContent className="p-6">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                Pages populaires
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                Les pages les plus consultées
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {top_pages
                                            ?.slice(0, 5)
                                            .map((page, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/40"
                                                >
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {page.path}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                        {page.views}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* DEVICES */}
                            <Card className="rounded-[32px] border border-white/20 bg-white/70 shadow-xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardContent className="p-6">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Répartition appareils
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            Utilisation selon les appareils
                                        </p>
                                    </div>

                                    <ResponsiveContainer
                                        width="100%"
                                        height={280}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={devices}
                                                dataKey="count"
                                                nameKey="device"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={3}
                                            >
                                                {devices?.map((_, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>

                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        {devices?.map((device, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                                            >
                                                <div className="text-emerald-500">
                                                    {getDeviceIcon(
                                                        device.device,
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {device.device}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {device.count} visites
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* BROWSERS */}
                        <Card className="mt-8 rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                            <CardContent className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Navigateurs utilisés
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            Répartition des visiteurs
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {browsers?.map((browser, idx) => (
                                        <div key={idx}>
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-emerald-500">
                                                        {getBrowserIcon(
                                                            browser.browser,
                                                        )}
                                                    </div>

                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {browser.browser}
                                                    </span>
                                                </div>

                                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {browser.count} visites
                                                </span>
                                            </div>

                                            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div
                                                    className="h-full rounded-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500"
                                                    style={{
                                                        width: `${
                                                            (browser.count /
                                                                browsers.reduce(
                                                                    (acc, b) =>
                                                                        acc +
                                                                        b.count,
                                                                    0,
                                                                )) *
                                                            100
                                                        }%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
