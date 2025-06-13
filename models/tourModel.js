const mongoose = require('mongoose')
const validator = require('validator');
const User = require('./userModel');
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        maxlength: [40, 'A tour name must have less or equal 40 characters'],
        minlength: [10, 'A tour name must have atleast 10 characters'],
        //validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,

    duration: {
        type: Number,
        required: [true, "A tour must have durations"]
    },
   maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have difficulty level"],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must have atleast 1'],
        max: [5, 'Rating must be below 5'],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
        validator: function(val) {
            return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
    }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a summary"]
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },

        coordinates: [Number], // longitude first,
        address: String,
        description: String 
    },
    locations: [
        {
            type: {
            type: String,
            default: 'Point',
            enum: ['Point']
            },

            coordinates: [Number], // longitude first,
            address: String,
            description: String, 
            day: Number
        }
    ],

    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]

}, {
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
})

//tourSchema.index({ price: 1 })
tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' })




tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
})

// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

// FOR EMBEDDING "GUIDES" WHEN NEW TOURS ARE CREATED
// tourSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises)
//     next();
// })


// tourSchema.post('save', function(next, doc) {
//     console.log(doc)
//     next()
// })


// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});


// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } })

    this.start = Date.now()
    next()
})

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-passwordChangedAt'
    })
    
    next()
})

/* tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`)
    next()
}) */

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function() {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true }  } })
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
