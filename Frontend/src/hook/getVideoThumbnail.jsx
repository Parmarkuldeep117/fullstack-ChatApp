export const getVideoThumbnail = (file) => {
    return new Promise((resolve) => {
        const video = document.createElement("video");
        const canvas = document.createElement("canvas");

        video.preload = "metadata";
        video.muted = true;
        video.src = URL.createObjectURL(file);

        video.onloadeddata = () => {
            video.currentTime = 0.5; // grab frame at 0.5s
        };

        video.onseeked = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const thumbnail = canvas.toDataURL("image/png");
            resolve(thumbnail);

            URL.revokeObjectURL(video.src);
        };
    });
};
