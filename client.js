const axios = require('axios');

const serverUrl = 'http://localhost:3000';

axios.get(`${serverUrl}/publicKey`)
  .then((response) => {
    const publicKey = response.data;


    // Первый сценарий: 
    // Клиент подписывает сообщение
    // Клиент обращается к серверу  и передает ему подписанное сообщение
    // Клиент проверяет статус верификации, возвращенный ему сервером
    const messageToSign1 = 'Привет, сервер!!';

    axios.post(`${serverUrl}/signMessage`, {
      message: messageToSign1,
    })
      .then((response) => {
        const signature1 = response.data.signature;

        axios.post(`${serverUrl}/verifySignature`, {
          signedMessage: messageToSign1,
          signature: signature1,
          publicKey,
        })
          .then((response) => {
            console.log('Первый сценарий:');
            console.log(`Верификация прошла: ${response.data.isValid ? 'Успешно' : 'Неуспешно'}`);
          })
          .catch((error) => {
            console.error('Ошибка при выполнении первого сценария:', error.message);
          });
      })
      .catch((error) => {
        console.error('Ошибка при подписании сообщения:', error.message);
      });


    // Второй сценарий: Получить случайное сообщение с сервера и верифицировать его подпись
    // Клиент запрашивает публичный ключ сервера
    // Клиент запрашивает генерацию случайного сообщения на сервере
    // Клиент осуществляет верификацию полученного сообщения

    axios.get(`${serverUrl}/generateRandomMessage`)
      .then((response) => {
        const randomMessage = response.data.randomMessage.toString();

        axios.post(`${serverUrl}/signMessage`, {
          message: randomMessage,
        })
          .then((response) => {
            const signature2 = response.data.signature;

            axios.post(`${serverUrl}/verifyRandomMessageSignature`, {
              message: randomMessage,
              signature: signature2,
              publicKey,
            })
              .then((response) => {
                console.log('Второй сценарий:');
                console.log(`Верификация прошла: ${response.data.isValid ? 'Успешно' : 'Неуспешно'}`);
              })
              .catch((error) => {
                console.error('Ошибка при выполнении второго сценария:', error.message);
              });
          })
          .catch((error) => {
            console.error('Ошибка при подписании случайного сообщения:', error.message);
          });
      })
      .catch((error) => {
        console.error('Ошибка при получении случайного сообщения:', error.message);
      });
  })
  .catch((error) => {
    console.error('Ошибка при получении публичного ключа:', error.message);
  });
