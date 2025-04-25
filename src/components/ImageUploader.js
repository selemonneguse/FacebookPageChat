import { useState } from "react";

function ImageUploader() {
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:3000/chat/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert("Image uploaded: " + data.filename);
        
      } else {
        alert("Upload failed");
      }
      setImageFile(null);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="d-flex w-50 mt-3">
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
