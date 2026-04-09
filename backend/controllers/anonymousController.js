import Anonymous from "../models/anonymousModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";

// Helper function to upload media to Cloudinary
const uploadMediaToCloudinary = async (file, type = "image") => {
  if (!file) return null;
  
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "anonymous_posts",
      resource_type: type === "video" ? "video" : "image",
    };

    if (type === "image") {
      uploadOptions.transformation = [{ width: 1080, height: 1080, crop: "limit" }];
    }

    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result.secure_url);
    }).end(file.buffer);
  });
};

// @desc    Create anonymous post (Logged in users only)
// @route   POST /api/anonymous/post
// @access  Private (Must be registered and logged in)
const createAnonymousPost = asyncHandler(async (req, res) => {
  const { content, tags } = req.body;
  const userId = req.user._id;

  if (!content) {
    res.status(400);
    throw new Error("Content is required");
  }

  let mediaUrl = null;
  let mediaType = null;

  if (req.file) {
    const fileType = req.file.mimetype;
    if (fileType.startsWith("image/")) {
      mediaUrl = await uploadMediaToCloudinary(req.file, "image");
      mediaType = "image";
    } else if (fileType.startsWith("video/")) {
      mediaUrl = await uploadMediaToCloudinary(req.file, "video");
      mediaType = "video";
    }
  }

  // Generate unique anonymous ID
  const anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const anonymousPost = await Anonymous.create({
    anonymousId,
    user: userId,
    content,
    media: mediaUrl,
    mediaType,
    tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
    isRead: false,
    readBy: []
  });

  res.status(201).json({
    success: true,
    message: "Anonymous post created successfully. Admin will review and share to WhatsApp group.",
    post: {
      id: anonymousPost.anonymousId,
      content: anonymousPost.content,
      media: anonymousPost.media,
      createdAt: anonymousPost.createdAt
    }
  });
});

// @desc    Get user's own anonymous posts
// @route   GET /api/anonymous/my-posts
// @access  Private
const getMyAnonymousPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Anonymous.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Anonymous.countDocuments({ user: userId });

  res.status(200).json({
    posts,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Get all anonymous posts (Admin only)
// @route   GET /api/anonymous/admin/all
// @access  Private/Admin
const getAllAnonymousPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const { date, isRead } = req.query;

  const query = {};
  
  if (isRead !== undefined) query.isRead = isRead === "true";
  
  // Filter by date
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.createdAt = { $gte: startDate, $lt: endDate };
  }

  const posts = await Anonymous.find(query)
    .populate("user", "name email username phone profile")
    .populate("sharedBy", "name email")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const total = await Anonymous.countDocuments(query);

  // Group posts by date
  const postsByDate = {};
  posts.forEach(post => {
    const dateKey = post.createdAt.toISOString().split('T')[0];
    if (!postsByDate[dateKey]) {
      postsByDate[dateKey] = [];
    }
    postsByDate[dateKey].push({
      id: post.anonymousId,
      content: post.content,
      media: post.media,
      mediaType: post.mediaType,
      tags: post.tags,
      isRead: post.isRead,
      readBy: post.readBy,
      sharedToWhatsApp: post.sharedToWhatsApp,
      sharedAt: post.sharedAt,
      sharedBy: post.sharedBy,
      createdAt: post.createdAt,
      user: {
        id: post.user._id,
        name: post.user.name,
        email: post.user.email,
        username: post.user.username,
        profile: post.user.profile
      }
    });
  });

  // Stats
  const totalPosts = await Anonymous.countDocuments();
  const readPosts = await Anonymous.countDocuments({ isRead: true });
  const unreadPosts = await Anonymous.countDocuments({ isRead: false });
  const sharedPosts = await Anonymous.countDocuments({ sharedToWhatsApp: true });
  const notSharedPosts = await Anonymous.countDocuments({ sharedToWhatsApp: false });

  res.status(200).json({
    postsByDate,
    page,
    pages: Math.ceil(total / limit),
    total,
    stats: {
      total: totalPosts,
      read: readPosts,
      unread: unreadPosts,
      shared: sharedPosts,
      notShared: notSharedPosts
    }
  });
});

// @desc    Mark anonymous post as read (Admin)
// @route   PUT /api/anonymous/admin/:id/read
// @access  Private/Admin
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.admin._id;
  const adminName = req.admin.name;

  const post = await Anonymous.findOne({ anonymousId: id });

  if (!post) {
    res.status(404);
    throw new Error("Anonymous post not found");
  }

  // Check if already read by this admin
  const alreadyRead = post.readBy.some(read => read.adminId.toString() === adminId.toString());
  
  if (alreadyRead) {
    res.status(400);
    throw new Error("You have already marked this post as read");
  }

  post.isRead = true;
  post.readBy.push({
    adminId: adminId,
    readAt: new Date()
  });
  
  await post.save();

  res.status(200).json({
    success: true,
    message: "Post marked as read",
    readBy: post.readBy,
    message: `Post marked as read by ${adminName}`
  });
});

// @desc    View who posted (Admin only)
// @route   GET /api/anonymous/admin/:id/view-poster
// @access  Private/Admin
const viewPoster = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Anonymous.findOne({ anonymousId: id }).populate("user", "name email username phone profile location skills");

  if (!post) {
    res.status(404);
    throw new Error("Anonymous post not found");
  }

  res.status(200).json({
    poster: {
      name: post.user.name,
      email: post.user.email,
      username: post.user.username,
      phone: post.user.phone,
      profile: post.user.profile,
      location: post.user.location,
      skills: post.user.skills
    },
    post: {
      id: post.anonymousId,
      content: post.content,
      media: post.media,
      createdAt: post.createdAt
    }
  });
});

// @desc    Share anonymous post to WhatsApp (Admin)
// @route   POST /api/anonymous/admin/:id/share-whatsapp
// @access  Private/Admin
const shareToWhatsApp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { whatsappGroupLink, customMessage } = req.body;
  const adminId = req.admin._id;
  const adminName = req.admin.name;

  const post = await Anonymous.findOne({ anonymousId: id }).populate("user", "name");

  if (!post) {
    res.status(404);
    throw new Error("Anonymous post not found");
  }

  if (post.sharedToWhatsApp) {
    res.status(400);
    throw new Error("This post has already been shared to WhatsApp");
  }

  // Prepare WhatsApp message
  const message = customMessage || `📢 *New Anonymous Message from TeensConnect Community*\n\n${post.content}\n\n👤 From: Anonymous Community Member\n📅 Date: ${new Date(post.createdAt).toLocaleDateString()}\n\nReply in the group to help! 🙏`;
  
  const encodedMessage = encodeURIComponent(message);
  
  // Use provided group link or default
  const groupLink = whatsappGroupLink || process.env.WHATSAPP_GROUP_LINK;
  
  if (!groupLink) {
    res.status(400);
    throw new Error("WhatsApp group link is required");
  }

  // Generate WhatsApp link
  const whatsappLink = `${groupLink}?text=${encodedMessage}`;

  // Mark as shared
  post.sharedToWhatsApp = true;
  post.sharedAt = new Date();
  post.sharedBy = adminId;
  await post.save();

  res.status(200).json({
    success: true,
    message: `Post shared to WhatsApp by ${adminName}`,
    whatsappLink,
    sharedAt: post.sharedAt,
    postContent: post.content
  });
});

// @desc    Share poster info to WhatsApp (Admin)
// @route   POST /api/anonymous/admin/:id/share-poster-whatsapp
// @access  Private/Admin
const sharePosterToWhatsApp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { whatsappGroupLink, customMessage } = req.body;
  const adminId = req.admin._id;
  const adminName = req.admin.name;

  const post = await Anonymous.findOne({ anonymousId: id }).populate("user", "name email username phone profile location skills");

  if (!post) {
    res.status(404);
    throw new Error("Anonymous post not found");
  }

  // Prepare WhatsApp message with poster info
  const message = customMessage || `📢 *Anonymous Poster Information - TeensConnect*\n\n📝 *Original Post:*\n${post.content}\n\n👤 *Poster Details:*\nName: ${post.user.name}\nEmail: ${post.user.email}\nUsername: ${post.user.username}\nPhone: ${post.user.phone || "Not provided"}\nLocation: ${post.user.location || "Not provided"}\nSkills: ${post.user.skills?.join(", ") || "Not specified"}\n\n📅 Posted on: ${new Date(post.createdAt).toLocaleDateString()}\n\nYou can now reach out to help! 🤝`;
  
  const encodedMessage = encodeURIComponent(message);
  
  const groupLink = whatsappGroupLink || process.env.WHATSAPP_GROUP_LINK;
  
  if (!groupLink) {
    res.status(400);
    throw new Error("WhatsApp group link is required");
  }

  const whatsappLink = `${groupLink}?text=${encodedMessage}`;

  res.status(200).json({
    success: true,
    message: `Poster information shared to WhatsApp by ${adminName}`,
    whatsappLink,
    posterInfo: {
      name: post.user.name,
      email: post.user.email,
      phone: post.user.phone
    }
  });
});

// @desc    Get unread posts count (Admin)
// @route   GET /api/anonymous/admin/unread-count
// @access  Private/Admin
const getUnreadCount = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;
  
  // Count posts not read by this admin
  const unreadPosts = await Anonymous.countDocuments({
    isRead: false
  });

  res.status(200).json({
    unreadCount: unreadPosts,
    message: unreadPosts === 0 ? "No unread posts" : `${unreadPosts} unread post(s)`
  });
});

// @desc    Delete anonymous post (Admin only)
// @route   DELETE /api/anonymous/admin/:id
// @access  Private/Admin
const deleteAnonymousPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Anonymous.findOne({ anonymousId: id });

  if (!post) {
    res.status(404);
    throw new Error("Anonymous post not found");
  }

  // Delete media from Cloudinary if exists
  if (post.media) {
    const publicId = post.media.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`anonymous_posts/${publicId}`);
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: "Anonymous post deleted successfully"
  });
});

export {
  createAnonymousPost,
  getMyAnonymousPosts,
  getAllAnonymousPosts,
  markAsRead,
  viewPoster,
  shareToWhatsApp,
  sharePosterToWhatsApp,
  getUnreadCount,
  deleteAnonymousPost
};