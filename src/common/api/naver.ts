import axios from 'axios';

export async function getNaverUserInfo(token: string) {
  await axios
    .get('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: '' } })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    });
  return null;
}
