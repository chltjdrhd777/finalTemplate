const axios = require("axios");
const { KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URL, KAKAO_ACCESS_TOKEN_URL } =
  process.env;

module.exports = async (code) => {
  const data = {
    grant_type: "authorization_code",
    client_id: KAKAO_CLIENT_ID,
    client_secret: KAKAO_CLIENT_SECRET,
    redirect_uri: KAKAO_REDIRECT_URL || "http://localhost:3000/oauth/kakao",
    code,
  };

  const queryString =
    "https://kauth.kakao.com/oauth/token?" +
    Object.keys(data)
      .map((key) => `${key}=${data[key]}`)
      .join("&");

  return await axios.post(queryString);
};
