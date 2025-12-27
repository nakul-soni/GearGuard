import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './firebase';

export const storageService = {
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  async uploadEquipmentImage(equipmentId: string, file: File): Promise<string> {
    const extension = file.name.split('.').pop();
    const path = `equipment/${equipmentId}/${Date.now()}.${extension}`;
    return this.uploadFile(file, path);
  },

  async uploadUserAvatar(userId: string, file: File): Promise<string> {
    const extension = file.name.split('.').pop();
    const path = `avatars/${userId}.${extension}`;
    return this.uploadFile(file, path);
  },

  async uploadRequestAttachment(requestId: string, file: File): Promise<string> {
    const extension = file.name.split('.').pop();
    const path = `requests/${requestId}/${Date.now()}_${file.name}`;
    return this.uploadFile(file, path);
  },

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  async listFiles(path: string): Promise<string[]> {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    const urls = await Promise.all(result.items.map(item => getDownloadURL(item)));
    return urls;
  },

  getFileRef(path: string) {
    return ref(storage, path);
  },
};
