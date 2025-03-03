const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
}
module.exports = { generateSlug };