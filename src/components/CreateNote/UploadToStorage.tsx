import React, { useState, useRef } from "react";
import { useDarkMode } from "../DarkMode";
import supabase from "../../utils/supabaseConfig";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import Overlay from "../UploadToStorage/Overlay";
import FileInput from "../UploadToStorage/FileInput";
import ExpirationSelector from "../UploadToStorage/ExpirationSelector";
import UploadButton from "../UploadToStorage/UploadButton";
import DiscardButton from "../UploadToStorage/DiscardButton";
import CopyFileLinkButton from "../UploadToStorage/CopyFileLinkButton";

interface UploadToStorageProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadToStorage: React.FC<UploadToStorageProps> = ({
  isOpen,
  onClose,
}) => {
  const { darkMode } = useDarkMode();
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [expiryTime, setExpiryTime] = useState<string>("6h");
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    setFileName(newFile ? newFile.name : null);
  };

  const handleFileDiscard = () => {
    setFile(null);
    setFileName(null);
    setFileUrl(null);
    setExpiryTime("6h");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertExpiryTimeToSeconds = (expiry: string): number => {
    const amount = parseInt(expiry.slice(0, -1), 10);
    const unit = expiry.slice(-1);

    if (unit === "h") {
      return amount * 3600;
    } else if (unit === "d") {
      return amount * 86400;
    }
    return 60;
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected.", {
        style: {
          borderRadius: "10px",
          background: darkMode ? "#333" : "#ABA",
          color: "#fff",
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const uniqueId = uuidv4();
      const newFileName = `${uniqueId}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("file_storage")
        .upload(newFileName, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const expiryInSeconds = convertExpiryTimeToSeconds(expiryTime);
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("file_storage")
          .createSignedUrl(newFileName, expiryInSeconds, {
            download: false,
          });

      if (signedUrlError) {
        throw new Error(signedUrlError.message);
      }

      setFileUrl(signedUrlData.signedUrl);
      toast.success("File uploaded successfully!", {
        style: {
          borderRadius: "10px",
          background: darkMode ? "#333" : "#ABA",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error((error as Error).message, {
        style: {
          borderRadius: "10px",
          background: darkMode ? "#333" : "#ABA",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyLinkToClipboard = () => {
    if (!fileUrl) {
      toast.error("File URL is empty or not set.", {
        style: {
          borderRadius: "10px",
          background: darkMode ? "#333" : "#ABA",
          color: "#fff",
        },
      });
      return;
    }
  
    navigator.clipboard
      .writeText(fileUrl)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          style: {
            borderRadius: "10px",
            background: darkMode ? "#333" : "#ABA",
            color: "#fff",
          },
        });
      })
      .catch(() => {
        toast.error("Failed to copy link. Please try again.", {
          style: {
            borderRadius: "10px",
            background: darkMode ? "#333" : "#ABA",
            color: "#fff",
          },
        });
      });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Overlay onClose={onClose} />
      <div
        className={`relative z-10 p-6 rounded-lg shadow-lg w-80 ${
          darkMode ? "bg-stone-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex items-start justify-between">
          <h2 className="pb-4 text-xl font-bold">Upload File</h2>
          {fileName && <DiscardButton onDiscard={handleFileDiscard} />}
        </div>
        <FileInput
          fileName={fileName}
          onFileChange={handleFileChange}
          darkMode={darkMode}
          fileUrl={fileUrl}
        />
        {!fileUrl && (
          <ExpirationSelector
            expiryTime={expiryTime}
            setExpiryTime={setExpiryTime}
            darkMode={darkMode}
            isOpenSelect={isOpenSelect}
            setIsOpenSelect={setIsOpenSelect}
          />
        )}
        {!fileUrl && (
          <UploadButton
            fileName={fileName}
            isLoading={isLoading}
            onUpload={handleUpload}
            onClose={onClose}
            darkMode={darkMode}
          />
        )}
        {fileUrl && (
          <CopyFileLinkButton
            onCopy={copyLinkToClipboard}
            fileUrl={fileUrl}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

export default UploadToStorage;
