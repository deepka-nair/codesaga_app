import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'developer'],
    default: 'user'
  },
  password_hash: {
    type: String,
    default: null,
    select: false
  },
  verified: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  coins: {
    type: Number,
    default: 0
  },
  completedMissions: {
    type: [String],
    default: []
  },
  completedChapters: {
    type: [Number],
    default: []
  },
  unlockedChapters: {
    type: [Number],
    default: [1]
  },
  currentWorld: {
    type: String,
    default: 'sql'
  },
  achievements: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  earnedAchievements: {
    type: [String],
    default: []
  },
  worldProgress: {
    sqlProgress: {
      currentChapter: { type: Number, default: 1 },
      currentMissionIndex: { type: Number, default: 0 },
      completedChapters: { type: [Number], default: [] },
      completedMissions: { type: [String], default: [] }
    },
    pythonProgress: {
      currentChapter: { type: Number, default: 1 },
      currentMissionIndex: { type: Number, default: 0 },
      completedChapters: { type: [Number], default: [] },
      completedMissions: { type: [String], default: [] }
    },
    javaProgress: {
      currentChapter: { type: Number, default: 1 },
      currentMissionIndex: { type: Number, default: 0 },
      completedChapters: { type: [Number], default: [] },
      completedMissions: { type: [String], default: [] }
    },
    frontendProgress: {
      currentChapter: { type: Number, default: 1 },
      currentMissionIndex: { type: Number, default: 0 },
      completedChapters: { type: [Number], default: [] },
      completedMissions: { type: [String], default: [] }
    },
    cppProgress: {
      currentChapter: { type: Number, default: 1 },
      currentMissionIndex: { type: Number, default: 0 },
      completedChapters: { type: [Number], default: [] },
      completedMissions: { type: [String], default: [] }
    },
    backendProgress: {
      currentChapter: { type: Number, default: 1 },
      currentMissionIndex: { type: Number, default: 0 },
      completedChapters: { type: [Number], default: [] },
      completedMissions: { type: [String], default: [] }
    }
  },
  certificates: {
    certificateIssued: { type: Boolean, default: false },
    certificateId: { type: String, default: '' },
    certificateIssuedAt: { type: String, default: '' },
    certificateName: { type: String, default: '' },
    worldCertificates: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }
}, {
  collection: 'codesaga_users',
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
