import { storage } from "./firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export async function uploadFileUsingString(path, file, format = 'data_url'){
    return uploadString(
        ref(storage, path),
        file,
        format,
    );
}

export async function getFileURL(path){
    if(path==null) return null;
    return getDownloadURL(ref(storage,path));
}