const uploadAvatarDir = (process.env.NODE_ENV === 'production') ? './uploads/userAvatars' : './ReadooRestProvider/uploads/userAvatars';
const uploadCoverDir = (process.env.NODE_ENV === 'production') ? './uploads/coverPages' : './ReadooRestProvider/uploads/coverPages';

module.exports = { uploadAvatarDir, uploadCoverDir };