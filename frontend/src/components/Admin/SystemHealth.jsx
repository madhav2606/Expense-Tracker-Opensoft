import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChartPie, CircleCheckBig, Clock, Cpu, Database, MemoryStick } from "lucide-react";

const SystemHealth = () => {
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHealthData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/health");
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const formatMemory = (memory) => {
        return (memory / (1024 * 1024)).toFixed(2)
    }

    return (
        <div className="p-6 border border-gray-400 rounded-lg shadow-lg m-5 max-w-screen">
            <h2 className="text-2xl font-bold flex items-center gap-4">
                <CircleCheckBig className="text-green-400" /> System Health
            </h2>
            <h4 className="text-sm font-bold mt-1 text-gray-400 mb-6">
                Real-time system performance metrics
            </h4>

            <ul className="space-y-3 grid grid-cols-3 grid-rows-1 space-x-5">
                <li className="text-gray-700 bg-gray-100 p-5 rounded-xl font-bold flex gap-5 h-18">
                    <ChartPie /> Status: {healthData.status}
                </li>
                <li className="text-gray-700 bg-gray-100 p-5 rounded-xl font-bold flex gap-5 h-18">
                    <Clock /> Uptime: {(healthData.uptime / 3600).toFixed(2)} hours
                </li>
                <li className="text-gray-700 bg-gray-100 p-5 rounded-xl font-bold flex gap-5 h-18">
                    <Cpu /> CPU Usage: {healthData.cpuUsage.toFixed(2)}%
                </li>
            </ul>

            <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 ">Memory Usage</h3>
                <p className="text-xl font-bold mb-2 text-gray-800">
                    {formatMemory(healthData?.freeMemory || 0)} / {formatMemory(healthData?.totalMemory || 0)} MB
                </p>
                <div className="w-full bg-gray-300 rounded-full h-2.5">
                    <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                        style={{
                            width: `${(((healthData?.totalMemory || 0) - (healthData?.freeMemory || 0)) / (healthData?.totalMemory || 1)) * 100}%`,
                        }}
                    ></div>
                </div>
            </div>

            <div className="mt-6 bg-gray-100 p-5 rounded-xl">
                <div className="flex items-center gap-5 font-semibold mb-2">
                    <Database /> Database Query Time
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${healthData.dbQueryTime > 300 ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min(healthData.dbQueryTime / 5, 100)}%` }}>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    {healthData.dbQueryTime}ms
                </p>
            </div>
        </div>
    );
};

export default SystemHealth;
