const pageNotFound = (req, res) => {
    res.status(404).json({ message: "Route doesn't exist" });
  };
  
  export default pageNotFound;