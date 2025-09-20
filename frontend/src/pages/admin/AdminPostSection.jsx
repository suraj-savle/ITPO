import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const AdminPostSection = () => {
  const [posts, setPosts] = useState([]);
  const [postHistory, setPostHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    type: "Internship", // Internship or Job
    location: "",
    description: "",
    requirements: "",
    stipend: "",
    applyLink: "",
  });

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/admin/posts", {
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
      const res = await fetch("http://localhost:5000/api/admin/post-history", {
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
      const res = await fetch("http://localhost:5000/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create post");
      toast.success("Post created successfully!");
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
      fetchPosts();
      fetchPostHistory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job / Internship Posts</h1>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showHistory ? "Show Active Posts" : "Show Post History"}
        </button>
      </div>

      {/* Admin Create Post Form */}
      <form onSubmit={handlePostSubmit} className="bg-white p-6 rounded-2xl shadow-md mb-8 space-y-4 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Post</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Job/Internship Title"
            value={formData.title}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          >
            <option value="Internship">Internship</option>
            <option value="Job">Job</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full h-24"
          required
        />

        <textarea
          name="requirements"
          placeholder="Requirements / Skills"
          value={formData.requirements}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full h-24"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="stipend"
            placeholder="Stipend / Package"
            value={formData.stipend}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
          <input
            type="text"
            name="applyLink"
            placeholder="Apply Link"
            value={formData.applyLink}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Post
        </button>
      </form>

      {/* List of Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(showHistory ? postHistory : posts).map((post) => (
          <div key={post._id} className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
            <p className="text-gray-500 text-sm">{post.company} • {post.type}</p>
            <p className="text-gray-700 mt-2 text-sm">{post.description}</p>
            <p className="text-gray-600 mt-1 text-xs">Requirements: {post.requirements || "N/A"}</p>
            <p className="text-gray-600 mt-1 text-xs">Location: {post.location || "Remote"}</p>
            <p className="text-gray-600 mt-1 text-xs">Stipend/Package: {post.stipend || "N/A"}</p>
            <p className="text-gray-600 mt-1 text-xs">Created: {new Date(post.createdAt).toLocaleDateString()}</p>
            {post.applyLink && (
              <a
                href={post.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Apply Now
              </a>
            )}
          </div>
        ))}
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default AdminPostSection;
