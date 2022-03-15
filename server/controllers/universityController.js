// const asyncHandler = require('express-async-handler');

// const University = require('../models/universityModel');


// const createUniversity = asyncHandler(async (req, res) => {
//   // POST request must contain the following three fields
//   const univObj = req.body;
//   univObj.attendees = [req.user._id];

//   // if (!name || !state ||!domains) {
//   //   res.status(400).json({msg: 'failed to include all fields'});
//   //   throw new Error('Please add all fields')
//   // }

//   // check what req.body looks like
//   console.log(univObj);
//   // console.log(name);
//   // console.log(state);
//   // console.log(domains);

//   await University.create(univObj, (err, univ) => {
//     if (err) throw new Error(err.message);
//     if (univ) {
//       res.status(201).json(univ);
//     }
//   });
// });


// module.exports = {
//   createUniversity
// };