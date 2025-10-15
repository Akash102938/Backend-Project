import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        // upload the file to Cloudinary and wait for completion
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        // remove local temp file if it exists
        try {
            if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath)
        } catch (e) {
            // non-fatal: log and continue
            console.warn('Failed to remove temp file:', localFilePath, e)
        }

        // file has been uploaded successfully
       // console.log('file is uploaded on cloudinary', response.secure_url || response.url)
       fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        // remove the locally saved temporary file if present
        try {
            if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath)
        } catch (e) {
            // ignore
        }
        console.error('Cloudinary upload failed:', error)
        return null
    }
}

export { uploadCloudinary }