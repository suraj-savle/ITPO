import Post from '../models/PostModel.js';

// Priority mapping for sorting
const priorityMap = {
  'high': 3,
  'medium': 2,
  'low': 1
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('createdBy', 'name email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, type, priority, targetAudience, expiresAt } = req.body;
    
    const post = new Post({
      title,
      content,
      type: type || 'general',
      priority: priority || 'medium',
      targetAudience: targetAudience || 'all',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: req.user._id,
    });
    
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { title, content, type, priority, targetAudience, expiresAt } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user is admin or the creator of the post
    if (req.user.role !== 'admin' && post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.type = type || post.type;
    post.priority = priority || post.priority;
    post.targetAudience = targetAudience || post.targetAudience;
    post.expiresAt = expiresAt ? new Date(expiresAt) : post.expiresAt;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user is admin or the creator of the post
    if (req.user.role !== 'admin' && post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get announcements for user based on role and target audience
export const getAnnouncementsForUser = async (req, res) => {
  try {
    const userRole = req.user.role;
    const currentDate = new Date();
    
    console.log('User role:', userRole);
    console.log('Current date:', currentDate);
    
    // Find announcements that target this user's role or 'all'
    let announcements = await Post.find({
      $and: [
        {
          $or: [
            { targetAudience: 'all' },
            { targetAudience: userRole }
          ]
        },
        {
          $or: [
            { expiresAt: null },
            { expiresAt: { $gt: currentDate } }
          ]
        }
      ]
    })
    .populate('createdBy', 'name email');
    
    console.log('Found announcements:', announcements.length);
    console.log('Announcements:', announcements);
    
    // Sort by priority (high > medium > low) then by creation date
    announcements = announcements.sort((a, b) => {
      const priorityA = priorityMap[a.priority] || 1;
      const priorityB = priorityMap[b.priority] || 1;
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }
      return new Date(b.createdAt) - new Date(a.createdAt); // Newer first
    }).slice(0, 5);
    
    res.json(announcements);
  } catch (error) {
    console.error('Error in getAnnouncementsForUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get post history for an admin
export const getPostHistory = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};