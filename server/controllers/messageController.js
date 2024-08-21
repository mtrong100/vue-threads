import * as messageService from "../services/messageService.js";

export const getMessages = async (req, res) => {
  const receiverId = req.params.receiverId;
  const senderId = req.user._id;

  try {
    const results = await messageService.getMessages(senderId, receiverId);

    return res
      .status(200)
      .json({ message: "Messages fetched successfully", results: results });
  } catch (error) {
    console.log("Error getting messages:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;

    if (!req.body.text)
      return res.status(400).json({ message: "Text is required" });

    const resutls = await messageService.sendMessage(
      senderId,
      receiverId,
      req.body.text
    );

    return res
      .status(200)
      .json({ message: "Message sent successfully", resutls: resutls });
  } catch (error) {
    console.log("Error sending message:", error.message);
    return res.status(400).json({ message: error.message });
  }
};
