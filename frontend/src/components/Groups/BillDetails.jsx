import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext"
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, PlusCircle, FileText, Users, X, Plus, Pencil, Trash } from "lucide-react";
import Toast from "../Message/Toast";
import { ConfirmModal } from "../Message/ConfirmModal";

const BillDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth()
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
    onConfirm: () => { },
  });

  const openConfirmModal = (message, action) => {
    setConfirmModal({
      isOpen: true,
      message,
      onConfirm: () => {
        action();
        setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } });
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

  const getname = (id) => {
    const member = groupMembers.find((member) => member._id === id);
    return member ? member.name : "Unknown";
  };


  // Add a new bill
  const addBill = async () => {
    if (!billDescription || !billAmount || payers.length === 0) {
      alert("Please fill all fields, select at least one payer and participant.");
      return;
    }

    // Validate total amount paid
    const totalPaid = payers.reduce((sum, payer) => sum + payer.amountPaid, 0);
    if (totalPaid !== parseFloat(billAmount)) {
      alert("Total paid amount does not match the bill amount.");
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
      setPayers(res.data.bill.payers);
      setSelectedParticipants(res.data.bill.participants);
      setIsModalOpen(false);
      showToast(res.data.message, 'success');
    } catch (error) {
      console.error("Error adding bill:", error);
      showToast(error.response.data.message, 'error');
    }
  };

  const editBill = async () => {
    try {
      await axios.put(`http://localhost:3000/updateBill/${currentBill._id}`, {
        description: billDescription,
        amount: billAmount,
        payers,
        status: "Unpaid",
        participants: selectedParticipants,
      });
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  }

  const deleteBill = async (billId) => {
    openConfirmModal("Are you sure you want to delete this bill?", async () => {
      try {
        let res = await axios.delete(`http://localhost:3000/deleteBill/${billId}`);
        fetchBills();
        showToast(res.data.message, 'success');
      } catch (error) {
        console.error("Error deleting bill:", error);
      }
    });
  }

  const getBillBalances = async () => {
    try {
     const user=JSON.parse(localStorage.getItem('user'))
      const res = await axios.get(`http://localhost:3000/getBalances/${groupId}?userId=${user?._id}`);
      setBalances(res.data);
      console.log(res)

    } catch (error) {
      console.error("Error fetching bill balances:", error);
    }
  }

  const settleUpBill = async (billId) => {
    try {
      await axios.put(`http://localhost:3000/updateBill/${billId}`, {
        status: "Paid",
      });
  
      // Refresh bills and balances
      fetchBills();
      getBillBalances();
      
      showToast("Bill settled successfully!", "success");
    } catch (error) {
      console.error("Error settling bill:", error);
      showToast("Failed to settle bill", "error");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } })}
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
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center space-x-2">
            <FileText className="w-8 h-8" />
            <span>Group Expenses</span>
          </h1>
        </div>

        <div className="p-8">
          {/* Back Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-md">
            <div className="mb-4 md:mb-0">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center space-x-3 bg-white hover:bg-gray-100 text-gray-700 py-3 px-5 rounded-lg transition-colors border border-gray-200"
              >
                <ArrowLeft className="w-6 h-6" />
                <span className="text-base font-medium">Back</span>
              </button>
            </div>
            {balances?.net!=0 && <div
              className={`text-2xl font-semibold ${balances.net >= 0 ? 'text-green-700' : 'text-red-700'
                } tracking-tight`}
            >
              {balances.net >= 0 ? 'You are owed' : 'You owe'} <span className="font-bold">₹{Math.abs(balances.net)}</span>
            </div>}
          </div>

          {/* Open Add Bill Modal Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition flex justify-center items-center space-x-2"
          >
            <Plus className="w-5 h-5" /> Add a Bill
          </button>

          {/* Bill List */}
          <div className="bg-gray-100 rounded-2xl p-6 mt-6">
            <h3 className="text-lg font-semibold mb-2 text-purple-700">Bills</h3>
            {bills.length === 0 ? (
              <p className="text-gray-500">No Bills yet.</p>
            ) : (
              bills.map((bill) => (
                <div
                  key={bill._id}
                  className="bg-white rounded-lg p-4 mb-3 hover:shadow-md transition-shadow duration-300 text-gray-800"
                >
                  <p className="text-lg font-semibold">{bill.description} - ₹{bill.amount}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-sm text-gray-600">
                        Paid by: {bill?.payers?.map((payer) => `${payer.userId.name} (₹${payer.amountPaid})`).join(", ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Participants: {bill?.participants?.map((p) => p.name).join(", ")}
                      </p>
                      <p className={`text-sm font-semibold ${bill.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                        Status: {bill.status}
                      </p>
                    </div>
                    <div className="space-x-3">
                      {/* Settle Up Button (Only shows if bill is Unpaid) */}
                      {bill.status !== "Paid" && (
                        <button
                          onClick={() => settleUpBill(bill._id)}
                          className="bg-green-600 p-2 rounded-xl text-white hover:bg-green-500 hover:cursor-pointer"
                        >
                          Settle Up
                        </button>
                      )}
                      <button onClick={() => editBill()} className="hover:bg-purple-700 bg-purple-800 p-2 rounded-xl text-white hover:cursor-pointer">
                        <Pencil />
                      </button>
                      <button onClick={() => deleteBill(bill._id)} className="bg-red-600 p-2 rounded-xl text-white hover:bg-red-500 hover:cursor-pointer">
                        <Trash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-purple-700">Add Bill</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-6 h-6 text-gray-600 hover:text-gray-900" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Description"
              value={billDescription}
              onChange={(e) => setBillDescription(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-100 mb-3"
            />
            <input
              type="number"
              placeholder="Total Amount"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-100 mb-3"
            />

            {/* Select Who Paid */}
            <h3 className="text-lg font-semibold mb-2 text-purple-700">Who Paid?</h3>
            {groupMembers.map((member) => (
              <div key={member._id} className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" onChange={() => togglePayer(member._id)} className="h-4 w-4" />
                  <span>{member.name}</span>
                </label>
                <input
                  type="number"
                  className="w-20 p-2 border rounded-lg mb-2"
                  placeholder="₹"
                  disabled={!payers.find((p) => p.userId === member._id)}
                  onChange={(e) => updatePayerAmount(member._id, e.target.value)}
                />
              </div>
            ))}

            <button onClick={addBill} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition">
              Add Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetails;
