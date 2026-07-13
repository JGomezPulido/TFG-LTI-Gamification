export const getImageUrl = (path) => {
    if(!path) return null;
    return `${import.meta.env.VITE_BACKEND_BASE_IMG_URL}${path}`;
}