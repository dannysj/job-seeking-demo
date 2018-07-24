const Mentor = require("../model/Mentor");
// Mentor.verifyInfoCompletion(93).then(e => console.log(typeof e))
// Mentor.getUserIDByMentorID(21).then(console.log).catch(console.log);


const MentorRelation = require('../model/MentorRelation')

MentorRelation.isMentorMenteeRelated(71,14).then(console.log).catch(console.log)
MentorRelation.isMentorMenteeRelated(71,19).then(console.log).catch(console.log)