import { Download, X } from "lucide-react";

const ImagePreview = ({ src, onClose }) => {
    if (!src) return null;
    const isVideo = src.includes("video/")
    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
            {/* Close */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:opacity-70"
            >
                <X size={28} />
            </button>

            {/* Download */}
            <a
                href={src}
                download
                className="absolute top-4 right-14 text-white hover:opacity-70"
            >
                <Download size={26} />
            </a>

            {
                isVideo ? <video
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                    controls
                    loop
                    autoPlay
                    src={src} /> : <img
                    src={src}
                    alt="preview"
                    className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                />
            }



        </div>
    );
};

export default ImagePreview;
