const getKakaoToken = require("./getToken");
const getKakaoUserInfo = require("./getUserInfo");

module.exports = {
  login: (req, res) => {},
  logout: (req, res) => {},
  signup: async (req, res) => {
    try {
      const { data: tokens } = await getKakaoToken(req.body.code);

      const {
        data: { kakao_account: profile },
      } = await getKakaoUserInfo(tokens.access_token);
      console.log(profile);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "카카오 인증 과정 중에 에러가 발생했습니다" });
    }
  },
};
