const notFound = (req, res) => res.status(404).send("Route does Not Found");

module.exports = notFound;
