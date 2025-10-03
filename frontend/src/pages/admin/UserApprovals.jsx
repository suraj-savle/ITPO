import { useState, useEffect } from "react";
import { CheckCircle, XCircle, User, Building, Search, Filter } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const UserApprovals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    fetchPendingUsers();
  }, [filterRole]);

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filterRole !== "all") params.append("role", filterRole);

      const response = await axios.get(
        `http://localhost:5000/api/admin/users/pending?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Fetch pending users error:", error);
      toast.error("Failed to fetch pending users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/users/${selectedUser._id}/approve`,
        {
          approved: actionType === "approve",
          comments
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(`User ${actionType}d successfully`);
      setShowModal(false);
      setSelectedUser(null);
      setComments("");
      fetchPendingUsers();
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent(actionType === 'approve' ? 'userApproved' : 'userRejected', {
        detail: { userId: selectedUser._id, action: actionType }
      }));
    } catch (error) {
      console.error("User action error:", error);
      toast.error(`Failed to ${actionType} user`);
    }
  };

  const openModal = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowModal(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading pending users...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve pending user registrations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="recruiter">Recruiters</option>
          <option value="mentor">Mentors</option>
        </select>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm ? "No users match your search" : "No pending approvals"}
            </div>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        {user.role === "recruiter" ? (
                          <Building className="w-6 h-6 text-indigo-600" />
                        ) : (
                          <User className="w-6 h-6 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{user.email}</span>
                          {user.phone && <span>{user.phone}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "student" ? "bg-blue-100 text-blue-700" :
                      user.role === "recruiter" ? "bg-purple-100 text-purple-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {user.role === "student" && (
                      <>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Department:</span>
                          <span className="ml-2 text-gray-600">{user.department}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Year:</span>
                          <span className="ml-2 text-gray-600">{user.year}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Roll No:</span>
                          <span className="ml-2 text-gray-600">{user.rollNo}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">CGPA:</span>
                          <span className="ml-2 text-gray-600">{user.cgpa}</span>
                        </div>
                      </>
                    )}
                    
                    {user.role === "recruiter" && (
                      <>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Company:</span>
                          <span className="ml-2 text-gray-600">{user.company}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Registered:</span>
                          <span className="ml-2 text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {user.skills && user.skills.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.skills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {user.skills.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{user.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openModal(user, "approve")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => openModal(user, "reject")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === "approve" ? "Approve" : "Reject"} User
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-600">
                Are you sure you want to {actionType} <strong>{selectedUser.name}</strong>?
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add any comments or feedback..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                  setComments("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUserAction}
                className={`flex-1 px-4 py-2 text-white rounded-md ${
                  actionType === "approve" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserApprovals;