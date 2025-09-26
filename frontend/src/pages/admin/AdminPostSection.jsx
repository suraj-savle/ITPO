import { useState, useEffect } from "react";
import {
  Plus,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  ExternalLink,
  History,
  FileText,
  Edit,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AdminPostSection = () => {
  const [posts, setPosts] = useState([]);
  const [postHistory, setPostHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [viewingApplications, setViewingApplications] = useState(null);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    type: "Internship",
    location: "",
    description: "",
    requirements: "",
    stipend: "",
    applyLink: "",
  });

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchPostHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/posts/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch post history");
      const data = await res.json();
      setPostHistory(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load post history");
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchPostHistory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const url = editingPost
        ? `http://localhost:5000/api/posts/${editingPost._id}`
        : "http://localhost:5000/api/posts";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok)
        throw new Error(`Failed to ${editingPost ? "update" : "create"} post`);
      toast.success(
        `Post ${editingPost ? "updated" : "created"} successfully!`
      );
      setFormData({
        title: "",
        company: "",
        type: "Internship",
        location: "",
        description: "",
        requirements: "",
        stipend: "",
        applyLink: "",
      });
      setEditingPost(null);
      fetchPosts();
      fetchPostHistory();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${editingPost ? "update" : "create"} post`);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete post");
      toast.success("Post deleted successfully!");
      fetchPosts();
      fetchPostHistory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  const fetchApplications = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/posts/${postId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load applications");
    }
  };

  useEffect(() => {
    if (viewingApplications) {
      fetchApplications(viewingApplications);
    }
  }, [viewingApplications]);

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || "",
        company: editingPost.company || "",
        type: editingPost.type || "Internship",
        location: editingPost.location || "",
        description: editingPost.description || "",
        requirements: editingPost.requirements || "",
        stipend: editingPost.stipend || "",
        applyLink: editingPost.applyLink || "",
      });
    }
  }, [editingPost]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-screen">
            <div className="text-gray-500">Loading posts...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100  mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Job & Internship Posts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage job postings
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
        >
          <History size={16} />
          {showHistory ? "Show Active Posts" : "Show Post History"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {editingPost ? "Edit Post" : "Post New Job"}
        </h2>

        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Software Developer Intern"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                placeholder="e.g., Tech Corp"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Internship">Internship</option>
                <option value="Job">Job</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Remote, New York, Hybrid"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements & Skills
            </label>
            <input
              type="text"
              name="requirements"
              placeholder="React, Node.js, Python (comma separated)"
              value={formData.requirements}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stipend/Salary
              </label>
              <input
                type="text"
                name="stipend"
                placeholder="e.g., $50,000/year, ₹25,000/month"
                value={formData.stipend}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Link
              </label>
              <input
                type="url"
                name="applyLink"
                placeholder="https://company.com/apply"
                value={formData.applyLink}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              type="submit"
            >
              <Plus className="w-4 h-4" />
              {editingPost ? "Update Post" : "Post Job Opening"}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setFormData({
                    title: "",
                    company: "",
                    type: "Internship",
                    location: "",
                    description: "",
                    requirements: "",
                    stipend: "",
                    applyLink: "",
                  });
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Your Job Posts ({(showHistory ? postHistory : posts).length})
        </h2>

        {(showHistory ? postHistory : posts).length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {showHistory ? "No post history" : "No Job Posts Yet"}
            </h3>
            <p className="text-gray-500">
              {showHistory
                ? "No posts have been created yet"
                : "Create your first job posting to start recruiting"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {(showHistory ? postHistory : posts).map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Building size={14} />
                        {post.company}
                      </div>
                      {post.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {post.location}
                        </div>
                      )}
                      {post.stipend && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {post.stipend}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      post.type === "Job"
                        ? "bg-green-100 text-green-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {post.type}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.description}
                </p>

                {post.requirements && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {post.requirements
                        .split(",")
                        .slice(0, 3)
                        .map((req, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                          >
                            {req.trim()}
                          </span>
                        ))}
                      {post.requirements.split(",").length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{post.requirements.split(",").length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewingApplications(post._id)}
                    className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Users className="w-4 h-4" />
                    View Applications
                  </button>
                  <button
                    onClick={() => setEditingPost(post)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applications Modal */}
      {viewingApplications && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium text-gray-900">Applications</h3>
              <button
                onClick={() => setViewingApplications(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {applications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No applications yet
                </p>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="border border-gray-200 rounded p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {app.student?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {app.student?.email}
                          </p>
                          <p className="text-xs text-gray-400">
                            {app.student?.department} • CGPA:{" "}
                            {app.student?.cgpa}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              app.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : app.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {app.status}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostSection;
