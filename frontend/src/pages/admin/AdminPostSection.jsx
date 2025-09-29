import { useState, useEffect } from "react";
import {
  Plus,
  Megaphone,
  Calendar,
  AlertCircle,
  History,
  FileText,
  Edit,
  Trash2,
  Bell,
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
    content: "",
    type: "general",
    priority: "medium",
    targetAudience: "all",
    expiresAt: "",
  });

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/admin/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch announcements");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const fetchPostHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/admin/post-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch announcement history");
      const data = await res.json();
      setPostHistory(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load announcement history");
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
        ? `http://localhost:5000/api/admin/posts/${editingPost._id}`
        : "http://localhost:5000/api/admin/posts";
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
        `Announcement ${editingPost ? "updated" : "created"} successfully!`
      );
      setFormData({
        title: "",
        content: "",
        type: "general",
        priority: "medium",
        targetAudience: "all",
        expiresAt: "",
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
      const res = await fetch(`http://localhost:5000/api/admin/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete post");
      toast.success("Announcement deleted successfully!");
      fetchPosts();
      fetchPostHistory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete announcement");
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
        content: editingPost.content || "",
        type: editingPost.type || "general",
        priority: editingPost.priority || "medium",
        targetAudience: editingPost.targetAudience || "all",
        expiresAt: editingPost.expiresAt ? new Date(editingPost.expiresAt).toISOString().slice(0, 16) : "",
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
            Announcements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage announcements for students, mentors, and recruiters
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
        >
          <History size={16} />
          {showHistory ? "Show Active Announcements" : "Show History"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {editingPost ? "Edit Announcement" : "Create New Announcement"}
        </h2>

        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Announcement Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Important Update: Placement Drive Schedule"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="general">General</option>
                <option value="placement">Placement</option>
                <option value="academic">Academic</option>
                <option value="event">Event</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="student">Students Only</option>
                <option value="mentor">Mentors Only</option>
                <option value="recruiter">Recruiters Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Announcement Content
            </label>
            <textarea
              name="content"
              placeholder="Write your announcement content here..."
              value={formData.content}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expires At (Optional)
            </label>
            <input
              type="datetime-local"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              type="submit"
            >
              <Plus className="w-4 h-4" />
              {editingPost ? "Update Announcement" : "Create Announcement"}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={() => {
                  setEditingPost(null);
                  setFormData({
                    title: "",
                    content: "",
                    type: "general",
                    priority: "medium",
                    targetAudience: "all",
                    expiresAt: "",
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
          <Megaphone className="w-5 h-5" />
          Your Announcements ({(showHistory ? postHistory : posts).length})
        </h2>

        {(showHistory ? postHistory : posts).length === 0 ? (
          <div className="text-center py-16">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {showHistory ? "No announcement history" : "No Announcements Yet"}
            </h3>
            <p className="text-gray-500">
              {showHistory
                ? "No announcements have been created yet"
                : "Create your first announcement to notify users"}
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
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bell size={14} />
                        {post.targetAudience}
                      </div>
                      {post.expiresAt && (
                        <div className="flex items-center gap-1">
                          <AlertCircle size={14} />
                          Expires: {new Date(post.expiresAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : post.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {post.priority}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.type === "urgent"
                          ? "bg-red-100 text-red-700"
                          : post.type === "placement"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {post.type}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.content}
                </p>

                <div className="flex gap-2">
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


    </div>
  );
};

export default AdminPostSection;
