import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Camera {
  id: string;
  name: string;
  type: 'webcam' | 'rtsp';
  deviceId?: string;
  rtspUrl?: string;
  isActive: boolean;
}

interface CameraState {
  cameras: Camera[];
  addCamera: (camera: Omit<Camera, 'id' | 'isActive'>) => void;
  updateCamera: (id: string, updates: Partial<Camera>) => void;
  removeCamera: (id: string) => void;
  toggleCamera: (id: string) => void;
}

export const useCameraStore = create<CameraState>()(
  persist(
    (set) => ({
      cameras: [],
      addCamera: (camera) =>
        set((state) => ({
          cameras: [...state.cameras, { ...camera, id: crypto.randomUUID(), isActive: false }],
        })),
      updateCamera: (id, updates) =>
        set((state) => ({
          cameras: state.cameras.map((cam) =>
            cam.id === id ? { ...cam, ...updates } : cam
          ),
        })),
      removeCamera: (id) =>
        set((state) => ({
          cameras: state.cameras.filter((cam) => cam.id !== id),
        })),
      toggleCamera: (id) =>
        set((state) => ({
          cameras: state.cameras.map((cam) =>
            cam.id === id ? { ...cam, isActive: !cam.isActive } : cam
          ),
        })),
    }),
    {
      name: 'camera-storage',
    }
  )
);