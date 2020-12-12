const express = require('express');
const router = express.Router();
const data = require('../data');
const comments = data.comments;
const users = data.users;
const attractions = data.attractions;


router.get('/comments/:id', async(req, res) => {
    const currentAttraction = await attractions.getAttraction(req.params.id);
    let commentsList = [];
    let i = 0;
    for (let x of currentAttraction.relatedCommentsId) {
        commentsList[i++] = await comments.getCommentsById(x.id);
    }
    let commentWithUserName = [];
    let index = 0;
    for (let x of commentsList) {
        let user = await users.getUserById(x.userId);
        commentWithUserName[index++] = { user: user.userName, comment: x.comment };
    }
    res.json(commentWithUserName);
});

router.post('/addComment', async(req, res) => {
    if (req.session.user) {
        try {
            let newComment = await comments.addComments(req.session.user.userId, req.body.attractionId, req.body.comment);
            let user = await users.getUserById(newComment.userId);
            let name = user.userName;
            let comment = newComment;
            res.json({ user: name, comment: comment.comment });
            return;
        } catch (e) {
            res.status(404).render('error/error', { error: e });
        }
    } else {
        res.redirect('/users/login');
    }
});

module.exports = router;