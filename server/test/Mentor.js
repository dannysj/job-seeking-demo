
// Mentor.verifyInfoCompletion(93).then(e => console.log(typeof e))

const Mentor = require("../model/Mentor");
Mentor.getMentorApplications().then(console.log).catch(console.log);

// getMentorCommentsByMentorID(7).then();