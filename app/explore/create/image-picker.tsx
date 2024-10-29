"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState();
  const imageInput = useRef();

  function handlePickClick() {
    imageInput.current.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-2 font-medium">
        {label}
      </label>
      <div className="flex items-start gap-6 mb-4">
        <div className="relative w-40 h-40 border-2 border-gray-400 flex justify-center items-center text-gray-400">
          {!pickedImage ? (
            <p>No image picked yet.</p>
          ) : (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              layout="fill"
              objectFit="cover"
            />
          )}
        </div>
        <input
          className="hidden"
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
        />
        <button
          className="bg-primary text-white py-2 px-4 rounded cursor-pointer hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
