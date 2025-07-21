import { useState } from "react";
import {Spinner} from 'react-bootstrap'; 

function ImageUploader({ messages, setMessages }) {
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setIsUploading(true);
      const response = await fetch("https://localhost:8443/chat/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      console.log("Response from server:", data);

      const newMessage = "Image Upload successful with post message: " + data.reply.message;
      const updatedMessages = [...messages, { role: "model", parts: newMessage }];
      setMessages(updatedMessages);

      setImageFile(null);
    } catch (error) {
      console.error("Upload error:", error);
    }
    finally{
      setIsUploading(false);
    }
  };

  return (
    <div className="d-flex w-50 mt-3">
      {isUploading && <Spinner animation="border"/>}
      <input
        type="file"
        className="form-control bg-dark text-light border-secondary"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <button className="btn btn-info ms-2" onClick={handleImageUpload}>
        Upload Image
      </button>
    </div>
  );

}

export default ImageUploader;
