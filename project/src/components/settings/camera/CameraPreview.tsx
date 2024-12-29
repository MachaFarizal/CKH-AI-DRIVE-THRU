import React, { useEffect, useRef } from 'react';

interface CameraPreviewProps {
  deviceId: string;
}

const CameraPreview = ({ deviceId }: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startPreview = async () => {
      try {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: deviceId,
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        stream = newStream;
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    if (deviceId) {
      startPreview();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [deviceId]);

  return (
    <div className="mt-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg shadow-lg aspect-video bg-gray-100 object-cover"
      />
    </div>
  );
};

export default CameraPreview;