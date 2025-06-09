
export interface Contact {
  id: string;
  name: string;
  publicKey: string;
  memo?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export class ContactService {
  private static STORAGE_KEY = 'stellar_contacts';

  static getContacts(): Contact[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static saveContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
    const contacts = this.getContacts();
    const now = new Date().toISOString();
    
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    
    contacts.push(newContact);
    this.saveContacts(contacts);
    
    return newContact;
  }

  static updateContact(id: string, updates: Partial<Contact>): Contact | null {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveContacts(contacts);
    return contacts[index];
  }

  static deleteContact(id: string): boolean {
    const contacts = this.getContacts();
    const filteredContacts = contacts.filter(c => c.id !== id);
    
    if (filteredContacts.length === contacts.length) return false;
    
    this.saveContacts(filteredContacts);
    return true;
  }

  static findContact(publicKey: string): Contact | null {
    const contacts = this.getContacts();
    return contacts.find(c => c.publicKey === publicKey) || null;
  }

  private static saveContacts(contacts: Contact[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contacts));
    }
  }
}
