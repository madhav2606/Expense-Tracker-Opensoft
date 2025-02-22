import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Plus, X, Clipboard, Check, Users, KeyRound } from "lucide-react";

const GroupBill = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`http://localhost:3000/getGroups/${user?._id}`);
      setGroups(res.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const createGroup = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))._id;
      const res = await axios.post(`http://localhost:3000/createGroup/${user}`, { name: groupName });
      setGroups([...groups, res.data.group]);
      setGroupName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const joinGroup = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      const res = await axios.post("http://localhost:3000/joinGroup", { inviteCode, userId });
      setGroups([...groups, res.data.group]);
      setInviteCode("");
      setIsJoinModalOpen(false);
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold tracking-tight">Group Expense Tracker</h1>
        </div>
        <div className="p-8">
          <div className="flex justify-between mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Create Group</span>
            </button>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              <KeyRound className="w-5 h-5" />
              <span>Join Group</span>
            </button>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-600" />
              <span>Your Groups</span>
            </h2>
            {groups.length === 0 ? (
              <p className="text-gray-500">No groups found.</p>
            ) : (
              groups.map((group) => (
                <div
                  key={group._id}
                  className="bg-white rounded-lg shadow-md p-4 mb-3 flex justify-between items-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <Link to={`/groups/${group._id}`} className="text-lg font-medium text-indigo-700 hover:underline">
                      {group.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{group.inviteCode}</span>
                      <button onClick={() => copyInviteCode(group.inviteCode)}>
                        {copiedCode === group.inviteCode ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clipboard className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/groups/${group._id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    View Bills
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-purple-600">Create Group</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-600 hover:text-gray-800" /></button>
            </div>
            <input
              type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 mb-3 focus:ring-indigo-500"
            />
            <button onClick={createGroup} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors duration-300">Create</button>
          </div>
        </div>
      )}

      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-yellow-600">Join Group</h3>
              <button onClick={() => setIsJoinModalOpen(false)}><X className="w-6 h-6 text-gray-600 hover:text-gray-800" /></button>
            </div>
            <input
              type="text" placeholder="Invite Code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 mb-3 focus:ring-yellow-500"
            />
            <button onClick={joinGroup} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg transition-colors duration-300">Join Group</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupBill;