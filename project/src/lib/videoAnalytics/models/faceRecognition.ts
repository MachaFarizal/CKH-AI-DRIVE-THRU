import * as faceapi from '@vladmandic/face-api';
import { supabase } from '../../supabase';

export class FaceRecognition {
  private static instance: FaceRecognition;
  private labeledDescriptors: faceapi.LabeledFaceDescriptors[] = [];
  private initialized = false;

  private constructor() {}

  static getInstance(): FaceRecognition {
    if (!FaceRecognition.instance) {
      FaceRecognition.instance = new FaceRecognition();
    }
    return FaceRecognition.instance;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Load face recognition models
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      ]);

      // Load customer face descriptors from database
      await this.loadCustomerDescriptors();
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize face recognition:', error);
      throw error;
    }
  }

  private async loadCustomerDescriptors() {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('id, face_encoding')
      .not('face_encoding', 'is', null);

    if (error) throw error;

    this.labeledDescriptors = customers
      .filter(c => c.face_encoding)
      .map(customer => {
        const descriptors = Float32Array.from(JSON.parse(customer.face_encoding));
        return new faceapi.LabeledFaceDescriptors(
          customer.id,
          [descriptors]
        );
      });
  }

  async recognizeFace(detection: faceapi.WithFaceLandmarks<WithFaceDetection<{}>>) {
    if (!this.initialized) await this.initialize();

    const descriptor = await faceapi.computeFaceDescriptor(detection);
    if (!descriptor) return null;

    const faceMatcher = new faceapi.FaceMatcher(this.labeledDescriptors);
    const match = faceMatcher.findBestMatch(descriptor);

    return {
      customerId: match.label,
      distance: match.distance,
      isMatch: match.distance < 0.6 // Threshold for matching
    };
  }

  async addNewFace(customerId: string, detection: faceapi.WithFaceLandmarks<WithFaceDetection<{}>>) {
    const descriptor = await faceapi.computeFaceDescriptor(detection);
    if (!descriptor) throw new Error('Failed to compute face descriptor');

    // Save to database
    const { error } = await supabase
      .from('customers')
      .update({ 
        face_encoding: JSON.stringify(Array.from(descriptor))
      })
      .eq('id', customerId);

    if (error) throw error;

    // Update local cache
    await this.loadCustomerDescriptors();
  }
}