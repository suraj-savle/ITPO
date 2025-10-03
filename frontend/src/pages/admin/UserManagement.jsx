import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Filter,
  Trash2,
  Search,
  UserCheck,
  Building,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import { toast } from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "mentor",
    companyName: "",
    department: "",
    phone: "",
    jobTitle: "",
    website: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchMentors();
  }, [filter]);

  // Add event listener for user approval updates
  useEffect(() => {
    const handleUserUpdate = () => {
      fetchUsers();
    };
    
    window.addEventListener('userApproved', handleUserUpdate);
    window.addEventListener('userRejected', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userApproved', handleUserUpdate);
      window.removeEventListener('userRejected', handleUserUpdate);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const url =
        filter === "all"
          ? "http://localhost:5000/api/admin/users"
          : `http://localhost:5000/api/admin/users?role=${filter}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "mentor",
          companyName: "",
          department: "",
          phone: "",
          jobTitle: "",
          website: "",
        });
        fetchUsers();
        toast.success("User created successfully");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/admin/delete-user/${userId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          fetchUsers();
          toast.success("User deleted successfully");
        } else {
          toast.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user");
      }
    }
  };

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/users?role=mentor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMentors(data.users);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  const handleAssignMentor = async (mentorId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/assign-mentor/${selectedStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mentorId }),
        }
      );

      if (response.ok) {
        setShowAssignModal(false);
        setSelectedStudent(null);
        fetchUsers();
        toast.success("Mentor assigned successfully");
      } else {
        toast.error("Failed to assign mentor");
      }
    } catch (error) {
      console.error("Error assigning mentor:", error);
      toast.error("Error assigning mentor");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-scrren">
            <div className="text-gray-500">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage system users and permissions
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 transition-all duration-200 shadow-lg font-medium"
          >
            <Plus size={20} />
            Create User
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                <option value="mentor">Mentors</option>
                <option value="recruiter">Recruiters</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users by Role */}
        {["student", "mentor", "recruiter"].map((roleType) => {
          const roleUsers = filteredUsers.filter(user => user.role === roleType);
          if (roleUsers.length === 0) return null;
          
          return (
            <div key={roleType} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${
                  roleType === "student" ? "bg-blue-100" :
                  roleType === "mentor" ? "bg-indigo-100" : "bg-green-100"
                }`}>
                  {roleType === "student" ? (
                    <GraduationCap className={`w-6 h-6 ${
                      roleType === "student" ? "text-blue-600" :
                      roleType === "mentor" ? "text-indigo-600" : "text-green-600"
                    }`} />
                  ) : roleType === "mentor" ? (
                    <UserCheck className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <Building className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {roleType}s ({roleUsers.length})
                </h2>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {roleUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          user.role === "student" ? "bg-blue-50" :
                          user.role === "mentor" ? "bg-indigo-50" : "bg-green-50"
                        }`}>
                          {user.role === "student" ? (
                            <GraduationCap size={16} className="text-blue-600" />
                          ) : user.role === "mentor" ? (
                            <UserCheck size={16} className="text-indigo-600" />
                          ) : (
                            <Building size={16} className="text-green-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{user.name}</h3>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 flex-shrink-0">
                        {user.role === "student" && !user.assignedMentor && (
                          <button
                            onClick={() => {
                              setSelectedStudent(user);
                              setShowAssignModal(true);
                            }}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                            title="Assign Mentor"
                          >
                            <UserPlus size={14} />
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Status</span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          user.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {user.status}
                        </span>
                      </div>

                      {user.role === "student" && (
                        <>
                          {user.department && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Department</span>
                              <span className="text-xs text-gray-700 font-medium truncate ml-2">{user.department}</span>
                            </div>
                          )}
                          {user.year && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Year</span>
                              <span className="text-xs text-gray-700 font-medium">{user.year}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Mentor</span>
                            <span className={`text-xs font-medium ${
                              user.assignedMentor ? "text-green-600" : "text-red-600"
                            }`}>
                              {user.assignedMentor ? "Assigned" : "Not Assigned"}
                            </span>
                          </div>
                          {user.isPlaced && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Placement</span>
                              <span className="text-xs text-green-600 font-medium">Placed</span>
                            </div>
                          )}
                        </>
                      )}

                      {user.role === "mentor" && (
                        <>
                          {user.department && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Department</span>
                              <span className="text-xs text-gray-700 font-medium truncate ml-2">{user.department}</span>
                            </div>
                          )}
                        </>
                      )}

                      {user.role === "recruiter" && (
                        <>
                          {user.company && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Company</span>
                              <span className="text-xs text-gray-700 font-medium truncate ml-2">{user.company}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Plus className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
              </div>
              
              <form onSubmit={handleCreateUser} className="space-y-5">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="mentor">Mentor</option>
                      <option value="recruiter">Recruiter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter password"
                    required
                  />
                </div>

                {/* Role-specific fields */}
                {formData.role === "mentor" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Electronics">Electronics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                )}

                {formData.role === "recruiter" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Enter company name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
                        <input
                          type="text"
                          value={formData.jobTitle || ''}
                          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="e.g., HR Manager"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Website</label>
                        <input
                          type="url"
                          value={formData.website || ''}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="https://company.com"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Mentor Modal */}
        {showAssignModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Assign Mentor
              </h2>
              <p className="text-gray-600 mb-6">
                Select a mentor for <strong>{selectedStudent.name}</strong>
              </p>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {mentors.map((mentor) => (
                  <button
                    key={mentor._id}
                    onClick={() => handleAssignMentor(mentor._id)}
                    className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{mentor.name}</div>
                    <div className="text-sm text-gray-600">{mentor.department}</div>
                    <div className="text-xs text-gray-500">{mentor.email}</div>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedStudent(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
