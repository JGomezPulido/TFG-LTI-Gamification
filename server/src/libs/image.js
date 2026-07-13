import multer from "multer"
import fs from "fs"
import path from "path"

export const uploadImage = (subfolder) => {
    const storage = multer.diskStorage(
         {
                destination: function (req, file, cb)  {
                     try {
                        const dirname = path.join('./public', req.course, subfolder);
                        fs.mkdirSync(dirname, { recursive: true }); // no falla si ya existe, y crea todos los niveles
                        cb(null, dirname);
                    } catch (err) {
                        cb(err);
                    }
                },
                filename: function (req, file, callback) {
                    const ext = path.extname(file.originalname); // extrae ".jpg", ".png", etc.
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null, uniqueSuffix + ext); // ej: "1720540213123-482910384.jpg"
                }
            }
    );

    return multer({storage});
}

export const deleteImage = async (path) => {
    try {
        await fs.promises.unlink(path);
        return true;
    } catch (error){
        console.log(`File could not be deleted ${error.message}`);
        return false;
    }       
}