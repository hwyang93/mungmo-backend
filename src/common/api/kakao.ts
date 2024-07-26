import axios from 'axios';

interface IuserInfo {
  name: string;
  email: string;
}

export async function getKakaoUserInfo(token: string) {
  let userInfo: IuserInfo;
  await axios
    .get('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: `Bearer ${token}` } })
    .then(({ data }) => {
      console.log(data.kakao_account);
      userInfo = { name: data.kakao_account.profile.nickname, email: data.kakao_account.email };
    })
    .catch(error => {
      console.log(error);
      return null;
    });
  return userInfo;
}
