// import Post model
const Post = require("./../model/postModel");

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({
            authorId: req.user._id,
        })
        // Adding Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};

        if (endIndex < posts.length) {
            result.next = {
                page: +page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        result.results = posts.slice(startIndex, endIndex);
        res.status(200).json(result);
    } catch (err) {
        throw err;
    }
};


// USING THE PAGINATION (SKIP) METHOD
// const limitValue = req.query.limit || 2;
//         const skipValue = req.query.skip || 0;
//         const posts = await Post.find({
//             authorId: req.user._id,
//         }).limit(limitValue).skip(skipValue);