import EmojiPicker from "emoji-picker-react";
import { NotebookTabs, Paperclip, Send, Smile, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { getVideoThumbnail } from "../hook/getVideoThumbnail";
import { useMessageStore } from "../store/useMessageStore";


const ChatInput = () => {

  const { sendMessages, isUploadingFile } = useMessageStore()

  const fileRef = useRef(null);
  const inputRef = useRef(null);

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);


  const handleFile = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // PDF size check
    if (
      selectedFile.type === "application/pdf" &&
      selectedFile.size > 20 * 1024 * 1024
    ) {
      toast.error("PDF max size is 20MB");
      return;
    }

    // VIDEO → generate thumbnail
    if (selectedFile.type.startsWith("video/")) {
      const thumbnail = await getVideoThumbnail(selectedFile);
      setPreview(thumbnail);       // string (dataURL)
      setFile(selectedFile);       // real video
      return;
    }

    // IMAGE / PDF
    setPreview(URL.createObjectURL(selectedFile));
    setFile(selectedFile);
  };


  // useEffect(() => {
  //   if (!showEmoji) {
  //     inputRef?.current.focus()
  //   }
  // }, [showEmoji])

  const handleEmojiClick = (emojiData) => {
    const input = inputRef.current;
    if (!input) return;

    const cursorPos = input.selectionStart;

    const newText =
      text.slice(0, cursorPos) +
      emojiData.emoji +
      text.slice(cursorPos);

    setText(newText);

    requestAnimationFrame(() => {
      input.focus();
      input.selectionStart =
        input.selectionEnd =
        cursorPos + emojiData.emoji.length;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    const formData = new FormData();
    formData.append("text", text);
    if (file) formData.append("image", file);

    await sendMessages(formData);

    setText("");
    setFile(null);
    setPreview(null);
    fileRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-base-300 p-3 bg-base-200 relative">

      {/* Image Preview */}
      {preview && (
        <div className="mb-2 relative w-fit">
          {file?.type === "application/pdf" ? (
            <div className="flex items-center gap-2 p-2 bg-base-300 rounded">
              <NotebookTabs size={20} />
              <span>{file.name}</span>
            </div>
          ) : (
            <img
              src={preview}
              alt="preview"
              className="h-20 rounded-lg object-cover"
            />
          )}

          <button
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
            className="absolute -top-2 -right-2 bg-base-300 rounded-full p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}



      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-16 left-3 z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            height={350}
            width={300}
          />
        </div>
      )}

      <div className="flex items-center gap-2">

        {/* Emoji Button (flex-start) */}
        <button
          type="button"
          onClick={() => setShowEmoji(p => !p)}
          className="btn bg-base-100 hover:bg-base-300"
        >
          <Smile size={20} />
        </button>

        {/* Image Button */}
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className="btn bg-base-100 hover:bg-base-300"
        >
          <Paperclip size={20} />
        </button>

        <input
          ref={fileRef}
          type="file"
          name="image"
          accept="image/*,video/*,application/pdf"
          hidden
          onChange={handleFile}
        />

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          name="text"
          placeholder="Type a text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input input-bordered flex-1"
        />

        {/* Send */}
        <button
          type="submit"
          className="btn bg-base-100 hover:bg-base-300"
          disabled={!text.trim() && !preview || isUploadingFile}
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
