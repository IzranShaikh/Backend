const Post = require('../models/postM');

require('mongoose').connect("mongodb+srv://NEON:" + process.env.DB_PASS + "@nodeproject1.73asn.mongodb.net/storeshare?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })
.then(() => {
    console.log("[+] Connected to Database");
})
.catch((err) => {
    console.log("[-] Failed to connect to Database"+err);
});

exports.getAllPosts = (req, res) => {
    const pageSize = +req.query.pagesize; //+ works as a typecast for numbers
    const currentPage = +req.query.page;
    let postQuery;
    let totalPosts = 0;
    if (req.query.onlyPublic == "public") {
        postQuery = Post.find({ visible: "public" }).select('title content visible creator').populate('creator', 'username'); //fetch for homepage
    } else {
        postQuery = Post.find({ creator: req.query.onlyPublic }).select('title content visible').populate('creator', 'username'); //fetch for myuploads page
    }
//     postQuery = Post.find({ visible: "public" }).select('title content visible creator').populate("creator", "username"); //fetch for homepage
    Post.countDocuments().then((count) => {
        totalPosts = count;
        if (currentPage && pageSize) {
            postQuery.skip(pageSize * (currentPage - 1))
                .limit(pageSize);
        }
        postQuery.then((docs) => {
            console.log(docs);
            res.status(200).json({
                message: 'Available Posts',
                count: totalPosts,
                posts: docs
            });
        })
        // .catch((err) => res.status(404).json({ message: "Error while fetching Thoughts", error: err }));
    });
}

exports.getOnePost = (req, res) => {
    Post.findById(req.params.postId)
    .select('title content visible')
    .populate('creator','username')
    .then(post => {
        if (post) {
            res.status(200).json(post);
            console.log(post);
        }
    })
    .catch((err) => res.status(404).json({ message: "No such Post available" }));
}

exports.uploadPost = (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        visible: req.body.visible,
        creator: req.userData._id,
    });
    
    post.save()
        .then((result) => {
        res.json({
            message: 'Thought Shared',
            post: {
                _id: result._id,
                title: result.title,
                content: result.content,
                visible: result.visible,
                creator: result.creator,
            }
        });
    })
        
}

exports.editPost = (req, res) => {
    Post.findById(req.params.postId)
    .then((result) => {
        const post = new Post({
            _id: req.body._id,
            title: req.body.title,
            content: req.body.content,
            visible: req.body.visible,
            creator: req.userData._id,
            creatorName: req.userData.username
        });
        Post.updateOne({ _id: req.params.postId, creator: req.userData._id }, post)
            .then((result) => {
            if (result.n > 0) {
                res.status(200).json({
                    message : "Post Updated"
                });
            } else {
                res.status(401).json({
                    message : "UNAUTHORIZED"
                })
            }
        })
        .catch((err) => {
            res.status(500).json({message:"Unable to edit post"});
        })
    })
}

exports.deleteOnePost = (req, res) => {
    Post.deleteOne({ _id: req.params.postId, creator: req.userData._id })
    .then((response) => {
        if (response.deletedCount > 0) {
            res.status(200).json({ message: "Post Deleted!" });
        } else {
            res.status(401).json({ message: "UNAUTHORIZED" });
        }
    
    })
    .catch((err) => {
        res.json({ message: "Couldn't Delete Post" });
    })
}

exports.deleteAllPost = (req, res) => {
    if (req.params.owner_key === process.env.OWNER_KEY) {
        Post.deleteMany({})
        .then((response) => {
            res.status(200).json({
                message: "Deleted all posts : " + response.deletedCount,
            })
        })
    }
}
