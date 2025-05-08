import { Loader } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Toast from '../Message/Toast'

const SmartSettleModal = ({ billId, fetchBills, getBillBalances, ToggleSettleUpModal }) => {
    const [settleBill, setSettleBill] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    useEffect(() => {
        fetchSmartSettle()
    }, [billId])

    const settleUpBill = async (billId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/updateBill/${billId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "Paid"
                })
            });
            if(res.status !== 200) {
                showToast("Failed to settle bill", "error");
                return;
            }
            fetchBills();
            getBillBalances();
            showToast("Bill settled successfully!", "success");
            ToggleSettleUpModal();
            setSettleBill([]);
        } catch (error) {
            console.error("Error settling bill:", error);
            showToast("Failed to settle bill", "error");
        }
    };

    const fetchSmartSettle = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getSmartBillSettle/${billId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            if (response.ok) {
                setSettleBill(data.settlements || [])
            } else {
                setError(data.message || "Failed to fetch settlement data")
                console.error("Error fetching smart settle data:", data.message)
            }
        } catch (error) {
            setError("An unexpected error occurred")
            console.error("Error fetching smart settle data:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="fixed inset-0 bg-purple-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 md:p-8 max-w-md w-full shadow-xl">
                    <div className="text-center">
                        <Loader className="w-10 h-10 md:w-12 md:h-12 animate-spin text-purple-600 mx-auto" />
                        <p className="mt-4 text-base md:text-lg text-gray-700">Calculating optimal settlements...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-80 flex items-center justify-center z-50 p-3 md:p-6">
            <div className="fixed top-4 right-4 left-4 flex flex-col items-end">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="p-4 md:p-6 border-b border-purple-200 flex justify-between items-center bg-purple-800 text-white">
                    <h2 className="text-lg md:text-xl font-bold">Smart Settlement Plan</h2>
                    <button
                        onClick={() => ToggleSettleUpModal()}
                        className="text-yellow-100 hover:text-yellow-300 focus:outline-none"
                    >
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
                    {error ? (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : settleBill.length === 0 ? (
                        <div className="text-center py-8 md:py-10">
                            <svg className="mx-auto h-10 w-10 md:h-12 md:w-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-500">No settlements needed for this bill.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 md:space-y-6">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4 mb-4 md:mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-xs md:text-sm text-yellow-700">
                                            Our algorithm has calculated the most efficient way to settle this bill.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-base md:text-lg font-medium text-purple-900 mb-3 md:mb-4">Required Transactions</h3>

                            {settleBill?.map((settlement, index) => (
                                <div key={index} className="bg-white shadow rounded-lg p-3 md:p-4 border border-purple-100 hover:border-purple-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-purple-100 rounded-full p-2 mr-3 md:mr-4">
                                                <svg className="h-5 w-5 md:h-6 md:w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{settlement?.from} pays {settlement?.to}</p>
                                                <p className="text-xs text-gray-500">Transaction #{index + 1}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base md:text-lg font-bold text-purple-800">${settlement?.amount}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-4 py-3 md:px-6 md:py-4 bg-purple-50 border-t border-purple-100 flex justify-end">
                    <button
                        onClick={() => ToggleSettleUpModal()}
                        className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-200 text-purple-900 rounded-md hover:bg-gray-300 mr-2 text-sm md:text-base"
                    >
                        Close
                    </button>
                    {settleBill.length > 0 && (
                        <button
                            className="px-3 py-1.5 md:px-4 md:py-2 bg-yellow-500 text-purple-900 rounded-md hover:bg-yellow-400 font-medium flex items-center text-sm md:text-base shadow-md"
                            onClick={() => settleUpBill(billId)}
                        >
                            Settled Up
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SmartSettleModal