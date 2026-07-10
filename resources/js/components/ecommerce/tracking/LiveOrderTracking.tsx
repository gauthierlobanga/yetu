/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/preserve-manual-memoization */
// resources/js/components/ecommerce/tracking/LiveOrderTracking.tsx
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Truck,
    MapPin,
    CheckCircle,
    Clock,
    Package,
    TrendingUp,
    BarChart3,
    PieChart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
} from 'react-leaflet';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart as RePieChart,
    Pie,
    Cell,
} from 'recharts';
import { toast } from 'sonner';

// Icône personnalisée pour le livreur
const deliveryIcon = new L.Icon({
    iconUrl: '/images/delivery-truck.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

interface TrackingEvent {
    id: number;
    type: string;
    title: string;
    description: string | null;
    location: { lat: number; lng: number; address?: string } | null;
    metadata?: any;
    occurred_at: string;
}

interface TrackingData {
    id: string;
    status: string;
    carrier: string | null;
    current_location: { lat: number; lng: number; address?: string } | null;
    estimated_delivery_at: string | null;
    tracking_number: string;
    events: TrackingEvent[];
}

interface Props {
    commandeId: string;
    initialTracking: TrackingData | null;
}

const STATUS_STEPS = [
    { key: 'pending', label: 'Commandée', icon: Package, progress: 0 },
    { key: 'pickup', label: 'En préparation', icon: Package, progress: 25 },
    { key: 'in_transit', label: 'En transit', icon: Truck, progress: 50 },
    {
        key: 'out_for_delivery',
        label: 'En livraison',
        icon: Truck,
        progress: 75,
    },
    { key: 'delivered', label: 'Livrée', icon: CheckCircle, progress: 100 },
];

// Haversine distance helper
function haversineDistance(
    coord1: [number, number],
    coord2: [number, number],
): number {
    const R = 6371; // km
    const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((coord1[0] * Math.PI) / 180) *
            Math.cos((coord2[0] * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export default function LiveOrderTracking({
    commandeId,
    initialTracking,
}: Props) {
    const [tracking, setTracking] = useState<TrackingData | null>(
        initialTracking,
    );
    const [lastEvent, setLastEvent] = useState<TrackingEvent | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(!initialTracking);
    const [error, setError] = useState<string | null>(null);

    // Chargement initial si non fourni
    useEffect(() => {
        if (!initialTracking) {
            setIsLoading(true);
            setError(null);
            axios
                .get(`/api/orders/${commandeId}/tracking`)
                .then((res) => {
                    setTracking(res.data.tracking);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setIsLoading(false);
                    setError("Impossible de charger le suivi de livraison. Peut-être qu'aucun suivi n'a encore été créé pour cette commande.");
                    toast.error('Impossible de charger le suivi de livraison');
                });
        }
    }, [commandeId, initialTracking]);

    // Écoute des événements en temps réel via Echo
    useEffect(() => {
        if (!window.Echo) {
            return;
        }

        const channel = window.Echo.private(`orders.${commandeId}`).listen(
            '.delivery.tracking.updated',
            (data: any) => {
                const newEvent = data.event;
                const updatedTracking = data.tracking;

                setTracking((prev) => {
                    if (!prev) {
                        return null;
                    }

                    return {
                        ...prev,
                        ...updatedTracking,
                        events: [newEvent, ...prev.events],
                        current_location:
                            newEvent.location || prev.current_location,
                    };
                });

                setLastEvent(newEvent);
                toast.success(newEvent.title, {
                    description: newEvent.description || '',
                    icon: <Truck className="h-4 w-4 text-emerald-500" />,
                });
                setTimeout(() => setLastEvent(null), 5000);
            },
        );

        return () => {
            channel.subscription.unsubscribe();
        };
    }, [commandeId]);

    // Points de la carte
    const mapPoints = useMemo(() => {
        if (!tracking) {
            return [];
        }

        return tracking.events
            .filter((e) => e.location)
            .map((e) => [e.location!.lat, e.location!.lng] as [number, number]);
    }, [tracking]);

    const lastPosition = useMemo(() => {
        if (!tracking) {
            return null;
        }

        if (tracking.current_location) {
            return [
                tracking.current_location.lat,
                tracking.current_location.lng,
            ] as [number, number];
        }

        return mapPoints.length > 0 ? mapPoints[mapPoints.length - 1] : null;
    }, [tracking, mapPoints]);

    const currentStepIndex = useMemo(() => {
        if (!tracking) {
            return -1;
        }

        return STATUS_STEPS.findIndex((s) => s.key === tracking.status);
    }, [tracking]);

    // Statistiques dérivées
    const distanceTraveled = useMemo(() => {
        if (mapPoints.length < 2) {
            return 0;
        }

        let total = 0;

        for (let i = 1; i < mapPoints.length; i++) {
            total += haversineDistance(mapPoints[i - 1], mapPoints[i]);
        }

        return Math.round(total * 10) / 10; // km avec 1 décimale
    }, [mapPoints]);

    const timeRemaining = useMemo(() => {
        if (!tracking?.estimated_delivery_at) {
            return null;
        }

        const diff =
            new Date(tracking.estimated_delivery_at).getTime() - Date.now();

        if (diff <= 0) {
            return 0;
        }

        return Math.ceil(diff / 60000); // minutes
    }, [tracking?.estimated_delivery_at]);

    const progressPercent = useMemo(() => {
        if (currentStepIndex < 0) {
            return 0;
        }

        return STATUS_STEPS[currentStepIndex].progress;
    }, [currentStepIndex]);

    // Données pour le graphique d'évolution du pourcentage
    const progressChartData = useMemo(() => {
        if (!tracking) {
            return [];
        }

        // Prendre chaque événement qui a changé le statut (ou tout événement) et y associer un pourcentage progressif
        const steps = STATUS_STEPS;
        const events = tracking.events.slice().reverse(); // du plus ancien au plus récent
        let currentProgress = 0;
        const data: { time: string; progress: number }[] = [];
        events.forEach((event) => {
            const stepIdx = steps.findIndex((s) => s.key === event.type);

            if (stepIdx !== -1) {
                currentProgress = steps[stepIdx].progress;
            }

            data.push({
                time: new Date(event.occurred_at).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                progress: currentProgress,
            });
        });

        return data;
    }, [tracking]);

    // Données pour le graphique en anneau (étapes complétées vs restantes)
    const pieData = useMemo(() => {
        const completed =
            currentStepIndex >= 0
                ? Math.min(currentStepIndex + 1, STATUS_STEPS.length)
                : 0;
        const total = STATUS_STEPS.length;
        const remaining = total - completed;

        return [
            { name: 'Complétées', value: completed, color: '#10b981' },
            { name: 'Restantes', value: remaining, color: '#e2e8f0' },
        ];
    }, [currentStepIndex]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-emerald-600">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
                <p className="text-sm font-medium">Chargement du suivi en cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900/50 dark:bg-red-950/20">
                <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>{error}</p>
            </div>
        );
    }

    if (!tracking) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
                <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>Aucune information de suivi disponible pour cette commande.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Notification contextuelle */}
            <AnimatePresence>
                {lastEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-lg backdrop-blur-md dark:border-emerald-800 dark:bg-emerald-950/30"
                    >
                        <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-emerald-600" />
                            <div>
                                <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                                    {lastEvent.title}
                                </p>
                                {lastEvent.description && (
                                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                                        {lastEvent.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Section statistiques + graphiques */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* KPI rapides */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin className="h-4 w-4" />
                            Distance parcourue
                        </div>
                        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                            {distanceTraveled.toFixed(1)} km
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="h-4 w-4" />
                            Temps restant
                        </div>
                        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                            {timeRemaining !== null
                                ? `${timeRemaining} min`
                                : '--'}
                        </p>
                    </div>
                </div>

                {/* Graphique linéaire de progression */}
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        Évolution de la progression
                    </h4>
                    {progressChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={150}>
                            <AreaChart data={progressChartData}>
                                <defs>
                                    <linearGradient
                                        id="progressGrad"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#10b981"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#10b981"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e2e8f0"
                                    strokeOpacity={0.5}
                                />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                />
                                <YAxis domain={[0, 100]} hide />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(255,255,255,0.9)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="progress"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="url(#progressGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-slate-400">
                            Pas encore de données
                        </p>
                    )}
                </div>
            </div>

            {/* Graphique en anneau : étapes */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <PieChart className="h-4 w-4 text-emerald-500" />
                        Étapes complétées
                    </h4>
                    <ResponsiveContainer width="100%" height={160}>
                        <RePieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                innerRadius={30}
                                paddingAngle={3}
                                stroke="none"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(255,255,255,0.9)',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                            />
                        </RePieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 flex justify-center gap-4 text-sm">
                        {pieData.map((d) => (
                            <div
                                key={d.name}
                                className="flex items-center gap-1"
                            >
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: d.color }}
                                />
                                <span className="text-slate-600 dark:text-slate-400">
                                    {d.name} : {d.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Carte (inchangée) */}
                {lastPosition && (
                    <div className="h-72 overflow-hidden rounded-2xl border border-slate-200 shadow-md dark:border-slate-700">
                        <MapContainer
                            center={lastPosition}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {mapPoints.map((point, idx) => (
                                <Marker
                                    key={idx}
                                    position={point}
                                    icon={
                                        idx === mapPoints.length - 1
                                            ? deliveryIcon
                                            : undefined
                                    }
                                >
                                    <Popup>
                                        {tracking.events.find(
                                            (e) =>
                                                e.location &&
                                                e.location.lat === point[0] &&
                                                e.location.lng === point[1],
                                        )?.title || 'Position'}
                                    </Popup>
                                </Marker>
                            ))}
                            {mapPoints.length > 1 && (
                                <Polyline
                                    positions={mapPoints}
                                    pathOptions={{
                                        color: '#10b981',
                                        weight: 4,
                                        dashArray: '10 10',
                                    }}
                                />
                            )}
                        </MapContainer>
                    </div>
                )}
            </div>

            {/* Timeline des étapes */}
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Progression
                    </h3>
                    {tracking.estimated_delivery_at && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            <Clock className="mr-1 inline h-3 w-3" />
                            Estimé{' '}
                            {new Date(
                                tracking.estimated_delivery_at,
                            ).toLocaleString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: 'numeric',
                                month: 'short',
                            })}
                        </span>
                    )}
                </div>

                <div className="relative">
                    {STATUS_STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                            <div
                                key={step.key}
                                className="flex gap-4 pb-8 last:pb-0"
                            >
                                {idx < STATUS_STEPS.length - 1 && (
                                    <div className="absolute top-8 left-4 h-full w-0.5 -translate-x-1/2">
                                        <motion.div
                                            className={`h-full w-0.5 origin-top ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                            initial={{ scaleY: 0 }}
                                            animate={{
                                                scaleY: isCompleted ? 1 : 0,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                )}
                                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900">
                                    {isCompleted ? (
                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-500 text-white">
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-emerald-500 bg-white">
                                            <motion.div
                                                className="h-2.5 w-2.5 rounded-full bg-emerald-500"
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 2,
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <StepIcon className="h-4 w-4 text-slate-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4
                                        className={`font-semibold ${isCompleted || isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}
                                    >
                                        {step.label}
                                    </h4>
                                    {tracking.events.find(
                                        (e) => e.type === step.key,
                                    )?.description && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {
                                                tracking.events.find(
                                                    (e) => e.type === step.key,
                                                )!.description
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Historique des événements */}
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
                <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                    Historique détaillé
                </h3>
                <div className="max-h-80 scrollbar-thin space-y-3 overflow-y-auto pr-2">
                    {tracking.events.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                        >
                            <div className="mt-0.5 rounded-full bg-emerald-100 p-1.5 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                {event.type === 'location_update' ? (
                                    <MapPin className="h-4 w-4" />
                                ) : (
                                    <Truck className="h-4 w-4" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="truncate font-medium text-slate-900 dark:text-white">
                                        {event.title}
                                    </p>
                                    <span className="shrink-0 text-xs text-slate-400">
                                        {new Date(
                                            event.occurred_at,
                                        ).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                {event.description && (
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {event.description}
                                    </p>
                                )}
                                {event.location && (
                                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                        <MapPin className="h-3 w-3" />
                                        {event.location.address ||
                                            `${event.location.lat.toFixed(4)}, ${event.location.lng.toFixed(4)}`}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
