const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helpers");

const MY_TOKEN = process.env.TELE_BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);

function sendMessage(chatId, messageText) {
  return axiosInstance
    .get("sendMessage", {
      chat_id: chatId,
      text: messageText,
    })
    .catch((ex) => {
      errorHandler(ex, "sendMessage", "axios");
    });
}

function getFile(fileId) {
  return axiosInstance
    .get("getFile", {
      file_id: fileId,
    })
    .catch((ex) => {
      errorHandler(ex, "getFile", "axios");
    });
}

async function processThePhoto(messageObj) {
  if (messageObj.photo && messageObj.photo.length !== 0) {
    //Taking the file id from the photo
    const fileId = messageObj.photo[messageObj.photo.length - 1].file_id;
    //Getting the file data using that file id
    const fileData = await getFile(fileId);
    if (fileData.data && fileData.data.result) {
      const fileName = fileData.data.result.file_path;
      // This the public url, for the user sent photo we can use
      const file_public_path = `https://api.telegram.org/file/bot${MY_TOKEN}/${fileName}`;
      return true;
    }
  }
  return false;
}

function isBotEnabledForThisChat(chatId) {
  //return ["chatId1","chatId2"].indexOf(chatId) !== -1;
  return true;
}

async function handleMessage(messageObj) {
  const messageText = messageObj.text || "";
  if (!messageText && !messageObj.photo) {
    errorHandler("No meesage text", "handleMessage");
    return "";
  }

  try {
    const chatId = messageObj.chat.id;

    if (!isBotEnabledForThisChat(chatId)) {
      return sendMessage(chatId, "Sorry this bot is not enabled for all users");
    }

    if (messageText.charAt(0) === "/") {
      const command = messageText.substr(1);
      switch (command) {
        case "start":
          // We want to send a welcome message to the user.
          return sendMessage(chatId, "Hi! I'm a bot. How can i help you!");

        default:
          return sendMessage(chatId, "Hey hi, i don't know that command");
      }
    } else if (messageObj.photo) {
      const success = await processThePhoto(messageObj);
      const message = success
        ? "Photo recieved successfully"
        : "Error while processing the photo";
      return sendMessage(chatId, "Received your photo");
    } else if (messageText) {
      return sendMessage(chatId, messageText);
    } else {
      return sendMessage(chatId, "Received your message!");
    }
  } catch (error) {
    errorHandler(error, "handleMessage");
  }
}

module.exports = { sendMessage, handleMessage };
