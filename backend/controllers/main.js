const fs = require("fs");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { storage } = require("../firebase");
const { ref, uploadBytes, getDownloadURL} = require('firebase/storage');

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
        
        // Call the generic function with the correct arguments
        const generatedMessage = await generateUniqueFacebookPost(process.env.PAGE_ID, process.env.PAGE_ACCESS_TOKEN, model);

        if (!generatedMessage) {
            return res.status(500).json({ error: "Failed to generate a unique post message." });
        }
        console.log("generatedMessage: ", generatedMessage);
        const postData = {
            message: generatedMessage,
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
            res.json({ success: true, message: generatedMessage});
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
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const storageRef = ref(storage, `images/${req.file.originalname + '-' + Date.now()}`); // Create a reference to the storage location
        // Upload the file using uploadBytes
        const snapshot = await uploadBytes(storageRef, req.file.buffer, { contentType: req.file.mimetype });

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        const response = await fetch('http://localhost:3000/chat/uploadPhotoToFacebook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: downloadURL, message: 'Check out this image!' }),
        });

        const data = await response.json();
        if (data.reply) {
            console.log(data.reply);
        } else if (data.error) {
            console.error(data.error);
        }
    } catch (error) {
        console.error("upload image failed: ", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.uploadPhotoToFacebook = async (req, res, next) => {
    try {
        console.log("upload image from URL");

        // Call the generic function with the correct arguments
        const generatedMessage = await generateUniqueFacebookPost(process.env.PAGE_ID, process.env.PAGE_ACCESS_TOKEN, model);

        if (!generatedMessage) {
            return res.status(500).json({ error: "Failed to generate a unique post message." });
        }
        console.log("generatedMessage: ", generatedMessage);

        const imageUrl = req.body.url; // Assuming the URL is sent in the request body

        if (!imageUrl) {
            return res.status(400).json({ error: "No image URL provided." });
        }

        const postData = {
            url: imageUrl,
            access_token: process.env.PAGE_ACCESS_TOKEN,
            message: generatedMessage || 'Uploaded image from URL!', // Optional message
        };

        const response = await fetch(
            `https://graph.facebook.com/${process.env.PAGE_ID}/photos`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            }
        );

        const data = await response.json();

        if (data.id) {
            console.log('successfully uploaded photo from URL: ', data.id);
            return res.json({ success: true });
        } else {
            console.error('failed to upload photo from URL: ', data);
            return res.status(500).json({ reply: "Image upload from URL failed!", error: data });
        }

    } catch (error) {
        console.error("upload image from URL failed: ", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Generic function to generate a unique Facebook post
async function generateUniqueFacebookPost(pageId, accessToken, aiModel) {
    try {
      // Step 1: Get existing posts from the page
      const existingPostsResponse = await fetch(
        `https://graph.facebook.com/v22.0/${pageId}/feed?access_token=${accessToken}`
      );
  
      const existingPostsData = await existingPostsResponse.json();
      const existingMessages = existingPostsData.data
        ? existingPostsData.data.map((post) => post.message).filter((message) => message)
        : [];
  
      console.log(`Existing messages on page ${pageId}:`, existingMessages);
  
      // Step 2: Send existing posts to the AI and get a new sentence
      const aiPrompt = `Give me a clear short sentence to post on a Facebook page that is different from these existing sentences: "${existingMessages.join(
        '", "'
      )}"`;
  
      const messageResponse = await aiModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: aiPrompt }],
          },
        ],
      });
  
      const textSentence = messageResponse.response.text();
      console.log(`send sentence for page ${pageId}:`, textSentence);
  
      return textSentence;
    } catch (error) {
      console.error(`Error generating unique Facebook post for page ${pageId}:`, error);
      return null; // Or throw an error, depending on how you want to handle it in different places
    }
}