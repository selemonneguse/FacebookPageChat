const fs = require("fs");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINIAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.handleChatRequest = async (req, res, next) => {
    try {
        const { messages } = req.body;
    
        if (!messages || !Array.isArray(messages)) {
            console.error("Invalid or missing messages in request body");
            return res.status(400).json({ error: "Invalid request body" });
        }
    
        // Extract the last user message
        const lastUserMessage = messages
            .filter(msg => msg.role === "user") // Get only user messages
            .pop(); // Get the most recent user message
    
        if (!lastUserMessage || !lastUserMessage.parts || lastUserMessage.parts.length === 0) {
            return res.status(400).json({ error: "No valid user message found" });
        }
    
        // Extract the actual text from the `parts` array
        const userText = lastUserMessage.parts[0].text;
    
        // If the user requests to upload a post, trigger the upload process
        if (userText.toLowerCase().includes("post")) {
            console.log("Triggering post upload...");
            const uploadResponse = await fetch("http://localhost:3000/chat/postToFacebook");
            const uploadData = await uploadResponse.json();
    
            if (uploadData.success) {
                return res.json({ reply: `Post uploaded successfully! Message: ${uploadData.message}` });
            } else {
                return res.status(500).json({ reply: "Image upload failed!", error: uploadData });
            }
        }
    
        const response = await model.generateContent({ contents: messages });
        console.log(response.response.text());

        res.json({ reply: response.response.text() });
    } catch (error) {
        console.error("GEMINI API error:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
};


exports.handlePostToFacebook = async (req, res, next) => {
    try {
        console.log("in postToFacebook");

        // שלב 1: קבלת הפוסטים הקיימים מהדף
        const existingPostsResponse = await fetch(
            `https://graph.facebook.com/v22.0/${process.env.PAGE_ID}/feed?access_token=${process.env.PAGE_ACCESS_TOKEN}`
        );

        const existingPostsData = await existingPostsResponse.json();
        const existingMessages = existingPostsData.data ? existingPostsData.data.map(post => post.message).filter(message => message) : [];

        console.log("Existing messages on the page:", existingMessages);

        // שלב 2: שליחת הפוסטים הקיימים ל-AI וקבלת משפט חדש
        const aiPrompt = `Give me a clear short sentence to post on my coffee business's Facebook page that is different from these existing sentences: "${existingMessages.join('", "')}"`;

        const messageResponse = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: aiPrompt }]
                }
            ]
        });

        const textSentence = messageResponse.response.text();
        console.log("Generated sentence from AI:", textSentence);

        // שלב 3: פרסום המשפט החדש בפייסבוק
        const postData = {
            message: textSentence,
            access_token: process.env.PAGE_ACCESS_TOKEN,
        };

        const response = await fetch(
            `https://graph.facebook.com/v22.0/${process.env.PAGE_ID}/feed`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            }
        );

        const data = await response.json();

        if (data.id) {
            console.log("successfully posted: ", data.id);
            res.json({ success: true, message: textSentence });
        } else {
            console.error("failed to post: ", data);
            res.status(400).json({ error: "Failed to post", details: data });
        }
    } catch (error) {
        console.error("server failed: ", error);
        res.status(500).json({ error: "Server error" });
    }
};
  
exports.handleUploadImage = async (req, res, next) => {
    try {
        console.log("upload image");

        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        console.log("Uploaded file:", req.file.filename);
        res.json({ success: true, filename: req.file.filename });
    } catch (error) {
        console.error("upload image failed: ", error);
        res.status(500).json({ error: "Server error" });
    }
};


