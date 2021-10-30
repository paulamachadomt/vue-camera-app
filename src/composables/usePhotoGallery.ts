import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Storage } from '@capacitor/storage'

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}


export function usePhotoGallery() {
  
  const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });


  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = await convertBlobToBase64(blob) as string;

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    }); 
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  //const { Camera, Filesystem } = Plugins;
  const photos = ref<UserPhoto[]>([]);
  const PHOTO_STORAGE = 'photos';
   
  const cachePhotos = () => {
    Storage.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value)
    });
  };

  watch(photos, cachePhotos);

    const loadSaved = async () => {
      const photoList = await Storage.get({ key: PHOTO_STORAGE });
      const photosInStorage = photoList.value ? JSON.parse(photoList.value) : [];
    
      for (const photo of photosInStorage) {
        const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
  
      photos.value = photosInStorage;
  }

  onMounted(loadSaved);

  const takePhoto = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
      
    const fileName = new Date().getTime() + '.jpeg';
    const savedFileImage = await savePicture(cameraPhoto, fileName);
      
    photos.value = [savedFileImage, ...photos.value];
        
  };

  const deletePhoto = async (photo: UserPhoto) => {
    // Remove this photo from the Photos reference data array
    photos.value = photos.value.filter((p) => p.filepath !== photo.filepath);

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  };

  return {
    photos,
    takePhoto,
    deletePhoto
  };
}