
// Mentor.verifyInfoCompletion(93).then(e => console.log(typeof e))

const Mentor = require("../model/Mentor");
const getMentorCommentsByMentorID = require("../model/Comment").getMentorCommentsByMentorID;
Mentor.getMentorDetail(7).then(console.log).catch(console.log)

// getMentorCommentsByMentorID(7).then();