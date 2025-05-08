import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChartPie, CircleCheckBig, Clock, Cpu, Database, Loader } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import AccessDenial from "../AuthRestrict/AccessDenial";

const SystemHealth = () => {
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchHealthData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/health`);
                setHealthData(response.data);
            } catch (err) {
                setError("Failed to fetch system health data.");
            } finally {
                setLoading(false);
            }
        };

        fetchHealthData();
        const interval = setInterval(fetchHealthData, 10000);
        return () => clearInterval(interval);
    }, []);

    if (user?.role !== "Admin") return <AccessDenial />;
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
                    <p className="mt-4 text-lg text-gray-700">Loading System Health...</p>
                </div>
            </div>
        )
    }

    const formatMemory = (memory) => (memory / (1024 * 1024)).toFixed(2);

    return (
        <div className="max-w-5xl mx-auto p-6 rounded-lg shadow-lg bg-white">

            <div className="flex items-center gap-3 mb-4">
                <CircleCheckBig className="text-green-500 w-7 h-7" />
                <h2 className="text-2xl font-semibold">System Health</h2>
            </div>
            <p className="text-gray-500 mb-6">Real-time system performance metrics</p>


            <div className="grid gap-6 md:grid-cols-3">

                <div className="p-4 bg-gray-100 rounded-lg flex items-center gap-4">
                    <ChartPie className="text-blue-500 w-6 h-6" />
                    <span className="text-gray-800 font-medium">Status: {healthData.status}</span>
                </div>


                <div className="p-4 bg-gray-100 rounded-lg flex items-center gap-4">
                    <Clock className="text-indigo-500 w-6 h-6" />
                    <span className="text-gray-800 font-medium">Uptime: {(healthData.uptime / 3600).toFixed(2)} hrs</span>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg flex items-center gap-4">
                    <Cpu className="text-red-500 w-6 h-6" />
                    <span className="text-gray-800 font-medium">CPU: {healthData.cpuUsage.toFixed(2)}%</span>
                </div>
            </div>


            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Memory Usage</h3>
                <p className="text-xl font-bold text-gray-800 mb-2">
                    {formatMemory(healthData.freeMemory)} / {formatMemory(healthData.totalMemory)} MB
                </p>
                <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-green-500 h-full transition-all"
                        style={{
                            width: `${(((healthData.totalMemory || 0) - (healthData.freeMemory || 0)) /
                                    (healthData.totalMemory || 1)) *
                                100
                                }%`,
                        }}
                    ></div>
                </div>
            </div>


            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-4 font-semibold mb-2">
                    <Database className="text-purple-500 w-6 h-6" />
                    Database Query Time
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full transition-all ${healthData.dbQueryTime > 300 ? "bg-red-500" : "bg-green-500"
                            }`}
                        style={{ width: `${Math.min(healthData.dbQueryTime / 5, 100)}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{healthData.dbQueryTime}ms</p>
            </div>
        </div>
    );
};

export default SystemHealth;
