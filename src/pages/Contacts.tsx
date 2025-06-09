
'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Edit2, Trash2, Contact, Copy } from 'lucide-react';
import { useStellar } from '@/contexts/StellarContext';
import { useToast } from '@/hooks/use-toast';

export default function Contacts() {
  const { contacts, addContact, updateContact, deleteContact } = useStellar();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    publicKey: '',
    memo: '',
    tags: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.publicKey) {
      toast({
        title: "Error",
        description: "Name and public key are required",
        variant: "destructive",
      });
      return;
    }

    const contactData = {
      name: formData.name,
      publicKey: formData.publicKey,
      memo: formData.memo,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    if (editingContact) {
      const success = updateContact(editingContact, contactData);
      if (success) {
        toast({
          title: "Success!",
          description: "Contact updated successfully",
        });
      }
    } else {
      addContact(contactData);
      toast({
        title: "Success!",
        description: "Contact added successfully",
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', publicKey: '', memo: '', tags: '' });
    setEditingContact(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (contact: any) => {
    setFormData({
      name: contact.name,
      publicKey: contact.publicKey,
      memo: contact.memo || '',
      tags: contact.tags.join(', ')
    });
    setEditingContact(contact.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (contactId: string) => {
    const success = deleteContact(contactId);
    if (success) {
      toast({
        title: "Success!",
        description: "Contact deleted successfully",
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Contacts
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your Stellar contacts
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="stellar-gradient text-white hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingContact ? 'Edit Contact' : 'Add New Contact'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contact name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicKey">Public Key *</Label>
                  <Input
                    id="publicKey"
                    value={formData.publicKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, publicKey: e.target.value }))}
                    placeholder="G... (Stellar public key)"
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memo">Default Memo</Label>
                  <Input
                    id="memo"
                    value={formData.memo}
                    onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                    placeholder="Default memo for transactions"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="friend, exchange, family"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmit} className="flex-1">
                    {editingContact ? 'Update' : 'Add'} Contact
                  </Button>
                  <Button variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contacts List */}
        {contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <Card key={contact.id} className="stellar-card p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Contact className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Added {new Date(contact.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(contact)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Public Key</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-mono text-xs truncate">
                        {contact.publicKey}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(contact.publicKey, 'Public key')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {contact.memo && (
                    <div>
                      <p className="text-xs text-muted-foreground">Default Memo</p>
                      <p className="text-sm">{contact.memo}</p>
                    </div>
                  )}

                  {contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="stellar-card p-8 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Contacts Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add contacts to make sending payments easier
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="stellar-gradient text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Contact
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
}
