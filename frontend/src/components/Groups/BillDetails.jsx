import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  PlusCircle, 
  FileText, 
  X, 
  Pencil, 
  Trash, 
  CreditCard,
  Calculator
} from "lucide-react";
import Toast from "../Message/Toast";
import { ConfirmModal } from "../Message/ConfirmModal";
import SmartSettleModal from "./SmartSettleModal";

const BillDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [billDescription, setBillDescription] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [payers, setPayers] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [balances, setBalances] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [isSmartSettleModalOpen, setIsSmartSettleModalOpen] = useState(false);

  // Open the update modal and set the selected bill
  const openUpdateModal = (bill) => {
    setCurrentBill(bill);
    setIsUpdateModalOpen(true);
  };

  const openConfirmModal = (message, action) => {
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: () => {
        action();
        setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} });
      }
    });
  };

  const showToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    fetchBills();
    fetchGroupMembers();
    getBillBalances();
  }, [groupId]);

  // Fetch bills for the group
  const fetchBills = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/getBills/${groupId}`);
      setBills(res.data || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    }
  };

  // Fetch group members
  const fetchGroupMembers = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/getGroup/${groupId}`);
      setGroupMembers(res.data.users || []);
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  // Handle payer selection
  const togglePayer = (memberId) => {
    const exists = payers.find((payer) => payer.userId === memberId);
    if (exists) {
      setPayers(payers.filter((payer) => payer.userId !== memberId));
    } else {
      setPayers([...payers, { userId: memberId, amountPaid: 0 }]);
    }
  };

  // Update payer's amount paid
  const updatePayerAmount = (memberId, amount) => {
    setPayers(
      payers.map((payer) =>
        payer.userId === memberId ? { ...payer, amountPaid: parseFloat(amount) || 0 } : payer
      )
    );
  };

  const getName = (id) => {
    const member = groupMembers.find((member) => member._id === id);
    return member ? member.name : "Unknown";
  };

  // Add a new bill
  const addBill = async () => {
    if (!billDescription || !billAmount || payers.length === 0) {
      showToast("Please fill all fields, select at least one payer and participant.", "warning");
      return;
    }

    // Validate total amount paid
    const totalPaid = payers.reduce((sum, payer) => sum + payer.amountPaid, 0);
    if (totalPaid !== parseFloat(billAmount)) {
      showToast("Total paid amount does not match the bill amount.", "warning");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/createBill", {
        group: groupId,
        description: billDescription,
        amount: billAmount,
        payers,
        participants: groupMembers,
      });

      setBills([...bills, res.data.bill]);
      setBillDescription("");
      setBillAmount("");
      setPayers([]);
      setSelectedParticipants([]);
      setIsModalOpen(false);
      showToast(res.data.message, 'success');
      getBillBalances();
    } catch (error) {
      console.error("Error adding bill:", error);
      showToast(error.response?.data?.message || "Error adding bill", 'error');
    }
  };

  const deleteBill = async (billId) => {
    openConfirmModal("Are you sure you want to delete this bill?", async () => {
      try {
        let res = await axios.delete(`http://localhost:3000/deleteBill/${billId}`);
        fetchBills();
        showToast(res.data.message, 'success');
        getBillBalances();
      } catch (error) {
        console.error("Error deleting bill:", error);
      }
    });
  };

  // Update bill details
  const updateBill = async () => {
    try {
      await axios.put(`http://localhost:3000/updateBill/${currentBill._id}`, currentBill);
      setIsUpdateModalOpen(false);
      fetchBills(); // Refresh the bill list after updating
      showToast("Bill updated successfully!", "success");
      getBillBalances();
    } catch (error) {
      console.error("Error updating bill:", error);
      showToast("Failed to update bill", "error");
    }
  };

  const getBillBalances = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await axios.get(`http://localhost:3000/getBalances/${groupId}?userId=${user?._id}`);
      setBalances(res.data);
    } catch (error) {
      console.error("Error fetching bill balances:", error);
    }
  };

  const ToggleSettleUpModal = async (bill) => {
    setCurrentBill(bill)
    setIsSmartSettleModalOpen(!isSmartSettleModalOpen);
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} })}
        />
        <div>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <FileText className="w-6 h-6" />
              <span>Group Expenses</span>
            </h1>
            <div className="w-24"></div> {/* Empty div for alignment */}
          </div>
        </div>

        <div className="p-6">
          {/* Balance Summary */}
          <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">Balance Summary</h2>
                {balances?.net !== undefined && (
                  <div
                    className={`text-2xl font-semibold ${
                      balances.net >= 0 ? 'text-green-600' : 'text-red-600'
                    } tracking-tight`}
                  >
                    {balances.net >= 0 ? 'You are owed' : 'You owe'}{' '}
                    <span className="font-bold">{formatCurrency(Math.abs(balances.net))}</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center space-x-2"
                >
                  <PlusCircle className="w-5 h-5" /> <span>Add Bill</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bill List */}
          <div className="bg-white rounded-xl border border-blue-100 shadow-lg overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <h3 className="text-xl font-semibold text-blue-800">Your Bills</h3>
            </div>
            
            {bills.length === 0 ? (
              <div className="text-center py-16 px-4">
                <FileText className="w-16 h-16 mx-auto text-blue-200 mb-4" />
                <p className="text-gray-500 text-lg">No bills yet. Add your first bill!</p>
              </div>
            ) : (
              <ul className="divide-y divide-blue-100">
                {bills.map((bill) => (
                  <li
                    key={bill._id}
                    className="p-4 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center mb-2">
                          <p className="text-lg font-semibold text-blue-800">{bill.description}</p>
                          <span
                            className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                              bill.status === 'Paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {bill.status}
                          </span>
                        </div>
                        <p className="text-lg font-medium text-blue-700">{formatCurrency(bill.amount)}</p>
                        <div className="text-sm text-gray-600 mt-2">
                          <p>
                            <span className="font-medium">Paid by:</span>{' '}
                            {bill?.payers
                              ?.map((payer) => `${payer.userId.name} (${formatCurrency(payer.amountPaid)})`)
                              .join(', ')}
                          </p>
                          <p className="mt-1">
                            <span className="font-medium">Participants:</span>{' '}
                            {bill?.participants?.map((p) => p.name).join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2 self-end md:self-center">
                        {bill.status !== 'Paid' && (
                          <button
                            onClick={() => ToggleSettleUpModal(bill)}
                            className="bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded-lg transition-colors font-medium flex items-center space-x-1"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Smart SettleUp</span>
                          </button>
                        )}
                        <button
                          onClick={() => openUpdateModal(bill)}
                          className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBill(bill._id)}
                          className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Add Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-blue-800">Add New Bill</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="What was this expense for?"
                  value={billDescription}
                  onChange={(e) => setBillDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input
                  type="number"
                  placeholder="₹0.00"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Who Paid?</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto p-2">
                  {groupMembers.map((member) => (
                    <div key={member._id} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          onChange={() => togglePayer(member._id)} 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{member.name}</span>
                      </label>
                      <input
                        type="number"
                        className="w-24 p-2 border rounded-lg"
                        placeholder="₹0.00"
                        disabled={!payers.find((p) => p.userId === member._id)}
                        onChange={(e) => updatePayerAmount(member._id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={addBill} 
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium"
            >
              Add Bill
            </button>
          </div>
        </div>
      )}

      {/* Update Bill Modal */}
      {isUpdateModalOpen && currentBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-blue-800">Update Bill</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="What was this expense for?"
                  value={currentBill.description}
                  onChange={(e) => setCurrentBill({ ...currentBill, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input
                  type="number"
                  placeholder="₹0.00"
                  value={currentBill.amount}
                  onChange={(e) => setCurrentBill({ ...currentBill, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Who Paid?</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto p-2">
                  {groupMembers.map((member) => {
                    const payerIndex = currentBill.payers.findIndex((p) => p.userId._id === member._id);
                    const payer = payerIndex !== -1 ? currentBill.payers[payerIndex] : null;

                    return (
                      <div key={member._id} className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!payer}
                            onChange={() => {
                              let updatedPayers = [...currentBill.payers];
                              if (payer) {
                                updatedPayers.splice(payerIndex, 1); // Remove payer
                              } else {
                                updatedPayers.push({ userId: member, amountPaid: 0 }); // Add new payer
                              }
                              setCurrentBill({ ...currentBill, payers: updatedPayers });
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{member.name}</span>
                        </label>
                        <input
                          type="number"
                          className="w-24 p-2 border rounded-lg"
                          placeholder="₹0.00"
                          value={payer?.amountPaid || ""}
                          disabled={!payer}
                          onChange={(e) => {
                            let updatedPayers = [...currentBill.payers];
                            updatedPayers[payerIndex] = { ...payer, amountPaid: parseFloat(e.target.value) || 0 };
                            setCurrentBill({ ...currentBill, payers: updatedPayers });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Status</label>
                <select
                  value={currentBill.status || "Unpaid"}
                  onChange={(e) => setCurrentBill({ ...currentBill, status: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <button
              onClick={updateBill}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-medium"
            >
              Update Bill
            </button>
          </div>
        </div>
      )}

      {
         isSmartSettleModalOpen && <SmartSettleModal fetchBills={fetchBills} getBillBalances={getBillBalances} ToggleSettleUpModal={ToggleSettleUpModal} billId={currentBill._id} />
      }

    </div>
  );
};

export default BillDetails;