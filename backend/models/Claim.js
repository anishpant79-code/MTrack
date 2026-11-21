
import mongoose from 'mongoose'

const claimSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Claim text is required'],
            trim: true,
            minlength: [10, 'Claim must contain at least 10 characters'],
            maxlength: [2000, 'Claim cannot exceed 2000 characters'],
        },

        category: {
            type: String,
            trim: true,
            default: 'General',
        },

        source: {
            type: String,
            trim: true,
            default: '',
            maxlength: 2000,
        },

        status: {
            type: String,
            enum: [
                'Pending',
                'Verified',
                'Contradicted',
                'Unverified',
            ],
            default: 'Pending',
        },

        isSaved: {
            type: Boolean,
            default: false,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true,
        },

        extractedDetails: {
            company: { type: String, default: '' },
            metric: { type: String, default: '' },
            previousPeriod: { type: String, default: '' },
            currentPeriod: { type: String, default: '' },
            claimedGrowthPercent: { type: Number, default: null },
            tolerancePercent: { type: Number, default: 0.5 },
        },

        evidence: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Evidence',
            },
        ],

        verification: {
            method: {
                type: String,
                default: '',
            },

            summary: {
                type: String,
                default: '',
            },

            aiExplanation: {
                type: String,
                default: '',
            },

            limitations: [{
                type: String,
            }],

            transparencyScore: {
                type: Number,
                min: 0,
                max: 100,
                default: null,
            },

            checkedAt: {
                type: Date,
                default: null,
            },

            inputs: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },

            calculation: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
)

claimSchema.index({ status: 1, createdAt: -1 })

const Claim = mongoose.model('Claim', claimSchema)

export default Claim
