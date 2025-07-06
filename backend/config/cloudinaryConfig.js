const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: 'dezcq9pcy',
  api_key: '373666287419634',
  api_secret: '8Ixbcrs_NTlpodrK4KGplOB2idI', // Replace with your actual secret
});

module.exports = cloudinary;