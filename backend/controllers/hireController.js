import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get all talents (users with skills)
// @route   GET /api/hire/talents
// @access  Private
const getTalents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build filter query
  const query = {
    // Only get users with at least one skill or CV
    $or: [
      { skills: { $exists: true, $not: { $size: 0 } } },
      { cv: { $exists: true, $ne: "" } }
    ]
  };

  // Search by name, email, or skills
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
      { skills: { $regex: req.query.search, $options: "i" } },
      { location: { $regex: req.query.search, $options: "i" } }
    ];
  }

  // Filter by skill
  if (req.query.skill) {
    query.skills = { $in: [new RegExp(req.query.skill, "i")] };
  }

  // Filter by location
  if (req.query.location) {
    query.location = { $regex: req.query.location, $options: "i" };
  }

  // Filter by min rating (if you add ratings later)
  if (req.query.minRating) {
    query.rating = { $gte: parseInt(req.query.minRating) };
  }

  const talents = await User.find(query)
    .select("-password")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  // Enhance talent data with additional info
  const talentsWithInfo = talents.map(talent => ({
    ...talent.toObject(),
    whatsappLink: talent.whatsappLink || generateWhatsAppLink(talent.whatsappNumber),
    contactInfo: {
      hasWhatsapp: !!talent.whatsappNumber,
      hasEmail: !!talent.email,
      hasPortfolio: !!talent.portfolioLink
    }
  }));

  res.status(200).json({
    talents: talentsWithInfo,
    page,
    pages: Math.ceil(total / limit),
    total,
    filters: {
      search: req.query.search || null,
      skill: req.query.skill || null,
      location: req.query.location || null
    }
  });
});

// @desc    Get talent by ID
// @route   GET /api/hire/talent/:id
// @access  Private
const getTalentById = asyncHandler(async (req, res) => {
  const talent = await User.findById(req.params.id).select("-password");

  if (!talent) {
    res.status(404);
    throw new Error("Talent not found");
  }

  // Generate WhatsApp link if not exists
  const whatsappLink = talent.whatsappLink || generateWhatsAppLink(talent.whatsappNumber);

  res.status(200).json({
    ...talent.toObject(),
    whatsappLink,
    contactInfo: {
      whatsapp: talent.whatsappNumber,
      email: talent.email,
      portfolio: talent.portfolioLink,
      location: talent.location
    }
  });
});

// @desc    Get talent by skill category
// @route   GET /api/hire/talents/skill/:skill
// @access  Private
const getTalentsBySkill = asyncHandler(async (req, res) => {
  const { skill } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {
    skills: { $in: [new RegExp(skill, "i")] }
  };

  const talents = await User.find(query)
    .select("-password")
    .limit(limit)
    .skip(skip)
    .sort({ rating: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json({
    talents,
    page,
    pages: Math.ceil(total / limit),
    total,
    skill
  });
});

// @desc    Get featured talents (top rated or most viewed)
// @route   GET /api/hire/talents/featured
// @access  Private
const getFeaturedTalents = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;

  const talents = await User.find({
    $or: [
      { skills: { $exists: true, $not: { $size: 0 } } },
      { cv: { $exists: true, $ne: "" } }
    ]
  })
    .select("-password")
    .limit(limit)
    .sort({ createdAt: -1 }); // You can change to rating or views

  res.status(200).json(talents);
});

// @desc    Generate WhatsApp message link
// @route   POST /api/hire/message
// @access  Private
const generateWhatsAppMessage = asyncHandler(async (req, res) => {
  const { talentId, message } = req.body;

  if (!talentId) {
    res.status(400);
    throw new Error("Talent ID is required");
  }

  const talent = await User.findById(talentId);

  if (!talent) {
    res.status(404);
    throw new Error("Talent not found");
  }

  if (!talent.whatsappNumber) {
    res.status(400);
    throw new Error("This talent hasn't provided a WhatsApp number");
  }

  // Generate WhatsApp link with pre-filled message
  const whatsappNumber = talent.whatsappNumber.replace(/\D/g, '');
  const defaultMessage = message || `Hi ${talent.name}, I saw your profile on TeensConnect and I'm interested in your skills. Let's connect!`;
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  res.status(200).json({
    whatsappLink,
    phoneNumber: talent.whatsappNumber,
    talentName: talent.name,
    message: defaultMessage
  });
});

// @desc    Get talent contact info for calling
// @route   GET /api/hire/talent/:id/contact
// @access  Private
const getTalentContact = asyncHandler(async (req, res) => {
  const talent = await User.findById(req.params.id).select("name whatsappNumber phone email location");

  if (!talent) {
    res.status(404);
    throw new Error("Talent not found");
  }

  // Generate call links (for mobile)
  const callLinks = {
    whatsappCall: talent.whatsappNumber ? `https://wa.me/${talent.whatsappNumber.replace(/\D/g, '')}` : null,
    phoneCall: talent.phone ? `tel:${talent.phone.replace(/\D/g, '')}` : null,
  };

  res.status(200).json({
    name: talent.name,
    email: talent.email,
    location: talent.location,
    whatsappNumber: talent.whatsappNumber,
    phoneNumber: talent.phone,
    callLinks,
    message: "You can contact this talent using the links above"
  });
});

// @desc    Search talents with advanced filters
// @route   POST /api/hire/talents/search
// @access  Private
const searchTalents = asyncHandler(async (req, res) => {
  const {
    keyword,
    skills,
    location,
    minExperience,
    maxDistance,
    availability
  } = req.body;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {};

  // Keyword search
  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { bio: { $regex: keyword, $options: "i" } },
      { skills: { $regex: keyword, $options: "i" } }
    ];
  }

  // Skills filter
  if (skills && skills.length > 0) {
    query.skills = { $in: skills.map(s => new RegExp(s, "i")) };
  }

  // Location filter
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  // Availability filter (add to schema if needed)
  if (availability) {
    query.availability = availability;
  }

  const talents = await User.find(query)
    .select("-password")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json({
    talents,
    page,
    pages: Math.ceil(total / limit),
    total,
    searchParams: { keyword, skills, location }
  });
});

// Helper function to generate WhatsApp link
const generateWhatsAppLink = (whatsappNumber) => {
  if (!whatsappNumber) return null;
  const cleanedNumber = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanedNumber}`;
};

// @desc    Get talent statistics
// @route   GET /api/hire/stats
// @access  Private
const getHireStats = asyncHandler(async (req, res) => {
  const totalTalents = await User.countDocuments({
    $or: [
      { skills: { $exists: true, $not: { $size: 0 } } },
      { cv: { $exists: true, $ne: "" } }
    ]
  });

  const topSkills = await User.aggregate([
    { $unwind: "$skills" },
    { $group: { _id: "$skills", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const talentsByLocation = await User.aggregate([
    {
      $match: {
        location: { $exists: true, $ne: "" }
      }
    },
    {
      $group: {
        _id: "$location",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    totalTalents,
    topSkills,
    talentsByLocation,
    message: "Talent marketplace statistics"
  });
});

export {
  getTalents,
  getTalentById,
  getTalentsBySkill,
  getFeaturedTalents,
  generateWhatsAppMessage,
  getTalentContact,
  searchTalents,
  getHireStats
};