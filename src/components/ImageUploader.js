import { useState } from "react";
import { Spinner } from "react-bootstrap";

function ImageUploader({ messages, setMessages }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelectAndUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        setIsUploading(true);

        const response = await fetch("https://localhost:8443/chat/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await response.json();
        console.log("Response from server:", data);

        const newMessage =
          "Image Upload successful with post message: " + data.reply.message;
        const updatedMessages = [
          ...messages,
          { role: "model", parts: newMessage },
        ];
        setMessages(updatedMessages);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setIsUploading(false);
      }
    };

    input.click(); // מפעיל את בחירת הקובץ
  };

  return (
    <div className="d-flex w-50 mt-3 align-items-center">
      {isUploading && <Spinner animation="border" className="me-2" />}
      <button className="btn btn-info" onClick={handleImageSelectAndUpload}>
        {isUploading ? "Uploading..." : "בחר והעלה תמונה"}
      </button>
    </div>
  );
}

export default ImageUploader;
