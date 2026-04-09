import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    profile: { 
        type: String, 
        default: "" 
    },
    cv: { 
        type: String, 
        default: "" 
    },
    bio: { 
        type: String, 
        default: "" 
    },
    location: { 
        type: String, 
        default: "" 
    },
    skills: [{ 
        type: String 
    }],
    interests: [{ 
        type: String 
    }],
    dateOfBirth: { 
        type: Date 
    },
    gender: { 
        type: String, 
        enum: ['male', 'female', 'other', 'prefer-not-to-say'] 
    },
    whatsappNumber: { 
        type: String 
    },
    whatsappLink: { 
        type: String 
    },
    portfolioLink: { 
        type: String 
    },
    profilePicture: { 
        type: String 
    },
    googleId: { 
        type: String, 
        unique: true, 
        sparse: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    authMethod: { 
        type: String, 
        enum: ['email', 'google'], 
        default: 'email' 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin', 'moderator'], 
        default: 'user' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: true 
});

const User = mongoose.model('User', userSchema);
export default User;