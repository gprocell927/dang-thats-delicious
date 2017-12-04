const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now()
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
        type: Number,
        require: 'You must supply coordinates!'
      }],
    address: {
      type: String,
      required: 'You must supply and address!'
    }
  },
  photo: String
});

storeSchema.pre('save', async function(next) {
  if(!this.isModified('name')){
    next(); //skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  // Find other store that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if(storesWithSlug.length){
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }

  next();
  // TODO make more resiliant so slugs are unique
});

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    // group everything based on tag field, then create a new field (count)
    // each time we group, count will add 1
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    // sort in descending order 
    { $sort: { count: -1 } }
  ]);
}
module.exports = mongoose.model('Store', storeSchema);
