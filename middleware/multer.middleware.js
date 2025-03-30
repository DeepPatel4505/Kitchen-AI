// import multer from 'multer'


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })

// const upload = multer({storage})


// export default upload


import multer from "multer";

const storage = multer.memoryStorage(); // Store file in memory, not disk
const upload = multer({ storage });

export default upload;
