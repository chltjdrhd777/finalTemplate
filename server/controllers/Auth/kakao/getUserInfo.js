const axios = require("axios");
module.exports = async (accessToken) => {
  return await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
