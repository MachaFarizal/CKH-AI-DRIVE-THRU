import { supabase } from '../supabase';
import { DetectedFace, DetectedPlate } from './types';

export class CustomerMatcher {
  private static instance: CustomerMatcher;
  private cache: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): CustomerMatcher {
    if (!CustomerMatcher.instance) {
      CustomerMatcher.instance = new CustomerMatcher();
    }
    return CustomerMatcher.instance;
  }

  async matchCustomer(face: DetectedFace, plate?: DetectedPlate) {
    let customer = null;

    // Try matching by face first
    if (face.id) {
      customer = await this.findCustomerByFaceId(face.id);
    }

    // If no match and we have a plate, try matching by plate
    if (!customer && plate?.plate) {
      customer = await this.findCustomerByPlate(plate.plate);
    }

    return customer;
  }

  private async findCustomerByFaceId(faceId: string) {
    // Check cache first
    if (this.cache.has(faceId)) {
      return this.cache.get(faceId);
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('face_id', faceId)
      .single();

    if (error || !data) return null;

    // Cache the result
    this.cache.set(faceId, data);
    return data;
  }

  private async findCustomerByPlate(plate: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .ilike('license_plate', plate)
      .single();

    if (error || !data) return null;
    return data;
  }

  clearCache() {
    this.cache.clear();
  }
}