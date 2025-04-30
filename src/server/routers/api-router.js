import 'dotenv/config'

import express from 'express';

// The router to use
export const api_router = express.Router();

// //* API Routes
// api_router.post('/submissionlog', async (req, res) => {
//   const { api_key } = req.body;
//   const master_api_key = process.env.MASTER_API_KEY;
  
//   // Make sure the api key is right
//   if(master_api_key == api_key) {

//     // Retrieve data from database and send to user
//     const submissions = await Submission.find({});
//     const data = { submissions: [] };

//     submissions.forEach(submission => { 
//       data.submissions.push(submission)
//     });

//     res.json({
//       submissions: data.submissions,
//     });
//   } else {
    
//     // Cheeky error
//     res.json({
//       submissions: [{
//         'error': 'Invalid api key.'
//       }],
//     });
//   }
// });

// export default { 
//   api_router
// }