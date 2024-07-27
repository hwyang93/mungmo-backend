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

export async function getClovaAnswer(question: string) {
  let answer = '';
  await axios
    .post(
      'https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-DASH-001',
      { messages: [{ role: 'user', content: question }], maxTokens: 400 },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-NCP-CLOVASTUDIO-API-KEY': process.env['X-NCP-CLOVASTUDIO-API-KEY'],
          'X-NCP-APIGW-API-KEY': process.env['X-NCP-APIGW-API-KEY'],
          'X-NCP-CLOVASTUDIO-REQUEST-ID': process.env['X-NCP-CLOVASTUDIO-REQUEST-ID']
        }
      }
    )
    .then(({ data }) => {
      answer = data.result.message.content;
    })
    .catch(error => {
      console.log(error.err);
    });
  return answer;
}
