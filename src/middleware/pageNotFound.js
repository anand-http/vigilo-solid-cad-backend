const pageNotFound = (req, res) => {
  res.status(404).json({ success: false, message: "Route doesn't exist" });
};

export default pageNotFound;