
import multer from "multer";


// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' folder
    },
    filename: function (req, file, cb) {
        // Save the file with the current date + original name
        cb(null, Date.now() + '-' + file.originalname);
    }
});
// Initialize upload
export const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 20000, files: 5 } });