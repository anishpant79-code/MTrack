
import mongoose from 'mongoose'

const evidenceSchema = new mongoose.Schema(
    {
        claim: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Claim',
            required: true,
            index: true,
        },

        sourceName: {
            type: String,
            required: true,
            trim: true,
        },

        sourceType: {
            type: String,
            enum: [
                'exchange_filing',
                'regulatory_document',
                'company_report',
                'news_report',
                'other',
            ],
            required: true,
        },

        sourceAuthority: {
            type: String,
            enum: [
                'official_primary',
                'reputable_secondary',
                'other',
            ],
            required: true,
        },

        sourceUrl: {
            type: String,
            trim: true,
            default: '',
        },

        documentTitle: {
            type: String,
            trim: true,
            default: '',
        },

        publishedAt: {
            type: Date,
            default: null,
        },

        reportingPeriod: {
            type: String,
            default: '',
        },

        // Relevant text extracted from the original document
        excerpt: {
            type: String,
            required: true,
            maxlength: 10000,
        },

        // Structured facts extracted from the document
        facts: [
            {
                metric: {
                    type: String,
                    required: true,
                },

                value: {
                    type: Number,
                    required: true,
                },

                unit: {
                    type: String,
                    default: '',
                },

                period: {
                    type: String,
                    default: '',
                },

                basis: {
                    type: String,
                    default: '',
                },
            },
        ],

        stance: {
            type: String,
            enum: [
                'supports',
                'contradicts',
                'neutral',
                'not_assessed',
            ],
            default: 'not_assessed',
        },

        retrievedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
)

evidenceSchema.index({ claim: 1, createdAt: -1 })

const Evidence = mongoose.model('Evidence', evidenceSchema)

export default Evidence
