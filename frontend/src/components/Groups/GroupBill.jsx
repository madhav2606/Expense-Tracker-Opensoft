import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  Clipboard,
  Check,
  Users,
  KeyRound,
  UserPlus,
  RefreshCw,
  Loader,
  Trash2
} from "lucide-react";
import Toast from "../Message/Toast";
import { ConfirmModal } from "../Message/ConfirmModal";

const GroupBill = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();
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
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getGroups/${user?._id}`);
      setGroups(res.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim()) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"))._id;
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/createGroup/${user}`, { name: groupName });
      setGroups([...groups, res.data.group]);
      setGroupName("");
      setIsModalOpen(false);
      showToast("Group created successfully!", "success");
    } catch (error) {
      showToast("Error creating group. Please try again.", "error");
      console.error("Error creating group:", error);
    }
  };

  const joinGroup = async () => {
    if (!inviteCode.trim()) return;

    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/joinGroup`, { inviteCode, userId });
      setGroups([...groups, res.data.group]);
      setInviteCode("");
      setIsJoinModalOpen(false);
      showToast("Joined group successfully!", "success");
    } catch (error) {
      showToast("Error joining group. Please check the invite code.", "error");
      console.error("Error joining group:", error);
    }
  };

  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const deleteGroup = async (groupId) => {
    openConfirmModal("Are you sure you want to delete this group?", async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/deleteGroup/${groupId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          setGroups(groups.filter(group => group._id !== groupId));
          showToast("Group deleted successfully!", "success");
        } else {
          showToast("Error deleting group. Please try again.", "error");
        }
      } catch (error) {
        showToast("Error deleting group. Please try again.", "error");
        console.error("Error deleting group:", error);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-lg text-purple-700">Loading Split Expense Manager...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-200 p-4 md:p-8">
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => { } })}
      />
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 md:p-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Split Expense Manager</h1>
          <p className="mt-2 text-purple-100">Create and manage shared expenses with friends and family</p>
        </div>

        <div className="p-4 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Create Group</span>
              </button>
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm mt-3 sm:mt-0"
              >
                <UserPlus className="w-5 h-5" />
                <span>Join Group</span>
              </button>
            </div>

            <button
              onClick={fetchGroups}
              className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-800 font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-purple-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Your Groups</span>
              </h2>
              {groups.length > 0 && (
                <div className="text-sm text-purple-500 font-medium">
                  {groups.length} {groups.length === 1 ? 'group' : 'groups'}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-200 mb-3"></div>
                  <div className="h-4 w-24 bg-purple-200 rounded"></div>
                </div>
              </div>
            ) : groups.length === 0 ? (
              <div className="py-10 text-center">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-purple-100 mb-4">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-purple-500 font-medium">No groups found.</p>
                <p className="text-purple-400 text-sm mt-1">Create or join a group to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groups.map((group) => (
                  <div
                    key={group._id}
                    className="bg-white rounded-lg border border-purple-100 p-4 md:p-5 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <Link
                          to={`/groups/${group._id}`}
                          className="text-lg font-medium text-purple-800 hover:text-purple-600 transition-colors"
                        >
                          {group.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-sm text-purple-500 font-mono bg-purple-50 py-1 px-2 rounded">
                            {group.inviteCode}
                          </span>
                          <button
                            onClick={() => copyInviteCode(group.inviteCode)}
                            className="text-purple-400 hover:text-purple-600 transition-colors"
                            title="Copy invite code"
                          >
                            {copiedCode === group.inviteCode ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clipboard className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => navigate(`/groups/${group._id}`)}
                        className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2 px-4 rounded-lg transition-colors font-medium flex items-center gap-2"
                      >
                        <span>View Bills</span>
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700 transition-colors hover:cursor-pointer p-2" 
                        onClick={() => deleteGroup(group._id)}
                        aria-label="Delete group"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-purple-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-md mx-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-purple-800">Create New Group</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-purple-400 hover:text-purple-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-5">
              <label htmlFor="groupName" className="block text-sm font-medium text-purple-700 mb-1">Group Name</label>
              <input
                id="groupName"
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-3 border border-purple-200 rounded-lg bg-purple-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                disabled={!groupName.trim()}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${groupName.trim()
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-200 text-purple-400 cursor-not-allowed'
                  }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-purple-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-md mx-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-purple-800">Join a Group</h3>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="text-purple-400 hover:text-purple-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-5">
              <label htmlFor="inviteCode" className="block text-sm font-medium text-purple-700 mb-1">Invite Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <input
                  id="inviteCode"
                  type="text"
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full p-3 pl-10 border border-purple-200 rounded-lg bg-purple-50 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="flex-1 py-2.5 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={joinGroup}
                disabled={!inviteCode.trim()}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${inviteCode.trim()
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-yellow-200 text-yellow-400 cursor-not-allowed'
                  }`}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupBill;