const clearCookie = ({ req, res }) => {
  res.clearCookie("refreshToken");
  return "Successfully logout";
};

export default clearCookie;
