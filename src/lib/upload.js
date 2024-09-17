import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React from 'react';

async function upload(file) {
    const storage = getStorage();
    const date = new Date();
    const storageRef = ref(storage, `images/${date.getTime()}_${file.name}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                reject(new Error("something went wrong: " + error.code));
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

export default upload;
