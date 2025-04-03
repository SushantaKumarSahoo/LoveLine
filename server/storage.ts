import { phoneChecks, type PhoneCheck, type InsertPhoneCheck } from "@shared/schema";

export interface IStorage {
  getPhoneCheck(id: number): Promise<PhoneCheck | undefined>;
  getPhoneCheckByNumber(phoneNumber: string): Promise<PhoneCheck | undefined>;
  createPhoneCheck(check: InsertPhoneCheck): Promise<PhoneCheck>;
}

export class MemStorage implements IStorage {
  private phoneChecks: Map<number, PhoneCheck>;
  currentId: number;

  constructor() {
    this.phoneChecks = new Map();
    this.currentId = 1;
  }

  async getPhoneCheck(id: number): Promise<PhoneCheck | undefined> {
    return this.phoneChecks.get(id);
  }

  async getPhoneCheckByNumber(phoneNumber: string): Promise<PhoneCheck | undefined> {
    return Array.from(this.phoneChecks.values()).find(
      (check) => check.phoneNumber === phoneNumber,
    );
  }

  async createPhoneCheck(insertCheck: InsertPhoneCheck): Promise<PhoneCheck> {
    const id = this.currentId++;
    const phoneCheck: PhoneCheck = { 
      ...insertCheck, 
      id,
      createdAt: new Date().toISOString() 
    };
    this.phoneChecks.set(id, phoneCheck);
    return phoneCheck;
  }
}

export const storage = new MemStorage();
