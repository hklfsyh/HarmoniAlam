const { Storage } = require('@google-cloud/storage');
const path = require('path');
require('dotenv').config();

const storage = new Storage({
    keyFilename: process.env.GCS_KEYFILE_PATH,
    projectId: process.env.GCS_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

/**
 * Mengunggah file ke Google Cloud Storage.
 * @param {object} file Objek file dari Multer.
 * @param {string} folderName Nama folder di dalam bucket (misal: 'articles' atau 'events').
 * @returns {Promise<string>} URL publik dari file yang diunggah.
 */
const uploadToGCS = (file, destination) => { // Ganti folderName menjadi destination
    return new Promise((resolve, reject) => {
        if (!file) return reject('No image file provided');

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFileName = `${uniqueSuffix}${path.extname(file.originalname)}`;
        
        // Gabungkan path destinasi dengan nama file baru
        const blob = bucket.file(`${destination}${newFileName}`);
        const blobStream = blob.createWriteStream({ resumable: false });

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
        }).on('error', (err) => {
            reject(`Unable to upload image, something went wrong: ${err}`);
        }).end(file.buffer);
    });
};

/**
 * Menghapus file dari Google Cloud Storage berdasarkan URL publiknya.
 * @param {string} fileUrl URL publik dari file yang akan dihapus.
 * @returns {Promise<string>} Pesan status.
 */
const deleteFromGCS = (fileUrl) => {
    return new Promise((resolve, reject) => {
        if (!fileUrl) {
            return resolve('No file URL provided.');
        }
        
        const bucketName = process.env.GCS_BUCKET_NAME;
        const fileName = fileUrl.replace(`https://storage.googleapis.com/${bucketName}/`, '');

        bucket.file(fileName).delete((err, apiResponse) => {
            if (err) {
                // Jangan gagalkan proses jika file memang sudah tidak ada (error 404)
                if (err.code === 404) {
                    return resolve(`File ${fileName} not found in GCS, continuing.`);
                }
                return reject(err);
            }
            resolve(`File ${fileName} deleted successfully.`);
        });
    });
};

module.exports = { uploadToGCS, deleteFromGCS };