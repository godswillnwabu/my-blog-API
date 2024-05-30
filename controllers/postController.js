// import the Post model object
const Post = require("./../model/postModel");
const User = require("./../model/userModel");

// get all published post
exports.getAllPublishedPost = async (req, res) => {
    // define possible queries
    const {query} = req;

    const {author, title, tags} = query;

    // build search query object to be able to filter results based on the query
    const searchQuery = {};

    if (author) {
        searchQuery.author = author;
    }

    if (title) {
        searchQuery.title = title;
    }

    if (tags) {
        searchQuery.tags = tags;
    }
    
    try {
        const post = await Post.find({ 
            author: {$regex: new RegExp(searchQuery.author, "i")},
            title: {$regex: new RegExp(searchQuery.title, "i")},
            tags: {$regex: new RegExp(searchQuery.tags, "i")}, 
            state: "published" });

        res.status(200).json({
            status: "success",
            post,
        });
    } catch (err) {
        throw err
    }
};

// get a single published post
exports.getASinglePublishedPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .where("state")
            .eq("published");

        if (!post) {
            return res.status(404).json({
                status: "Failed",
                message: "Post with given Id not found"
            });
        } else {
            // increment the `readCount` property
            post.readCount === 0 ? post.readCount++ : post.readCount++;
            await post.save();
        }
        res.status(200).json({
            status: "success",
            post,
        });
    } catch (err) {
        throw err;
    }
};

// create a new post
exports.createAPost = async (req, res) => {
    try {
        const { title, description, tags, body } = req.body;

        // calculate read time of post from the body passed in
        const wpm = 225; //wpm => word per minute
        const numberOfWords = body.trim().split(/\s+/).length;
        const readTime = Math.ceil(numberOfWords / wpm) + "mins";

        // get author name and author Id
        let { firstname, lastname } = req.user;

        let author = `${firstname} ${lastname}`;
        let authorId = req.user._id;

        const post = await Post.create({
            title,
            description,
            tags,
            body,
            author,
            authorId,
            readTime,
        });

        // add the new created post to 'posts' array property on the user docoument
        let user = await User.findById(req.user._id);
        user.posts.push(post._id);
        await user.save(); // save changes made to the user doc

        // send back response
        res.status(201).json({
            status: "success",
            post,
        });
    } catch (err) {
        throw err
    }
};

// update a post
exports.updateAPost = async (req, res) => {
    const { state, body, title, tags, description } = req.body;

    try {
        const post = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: { state, body, title, tags, description },
            },
            { new: true }
        );

        // check if post belongs to the user initiating the request
        if (post.authorId.toString() !== req.user.id) {
            console.log(req.user.id)
            return res.status(401).json({
                status: 'Fail',
                message: `You can only update a post you created!`
            });
        }
        res.status(200).json({
            status: 'success',
            post
        });
    } catch (err) {
        throw err;
    }
};

// delete a post 
exports.deleteAPost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.postId, {
            authorId: req.user.id,
        });
        
        if (!post) 
            return res.status(404).json({
            status: 'Fail',
            message: 'Post with given Id not found',
        });

        if (post.authorId.toString() !== req.user.id) {
            return res.status(401).json({
                status: "Fail",
                message: `You can only delete a post you created!`,
            });
        }

        //delete post from 'posts' array in the user document
        const postByUser = await User.findById(req.user._id);
        postByUser.posts.pull(post._id);
        await postByUser.updateOne({ posts: postByUser.posts });

        // return deleted post
        res.status(200).json({
            status: "success",
            message: "Post deleted successfully",
        });
    } catch (err) {
        throw err;
    }
};