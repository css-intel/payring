/**
 * Contacts Screen
 * Manage contacts and address book
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Star, 
  MoreVertical, 
  Send, 
  ArrowDownLeft,
  UserPlus,
  Users,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/avatar';
import { useAuthStore } from '@/store';
import { searchUsers, UserSearchResult } from '../services/contacts.service';

interface Contact {
  id: string;
  displayName: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  isFavorite: boolean;
  lastInteraction?: Date;
}

export function ContactsScreen() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');

  // Mock contacts - in real app would come from Firestore
  const [contacts] = useState<Contact[]>([
    { id: '1', displayName: 'Sarah Wilson', username: 'sarahw', email: 'sarah@example.com', isFavorite: true },
    { id: '2', displayName: 'Mike Johnson', username: 'mikej', email: 'mike@example.com', isFavorite: true },
    { id: '3', displayName: 'Emily Rodriguez', username: 'emilyr', email: 'emily@example.com', isFavorite: false },
    { id: '4', displayName: 'David Kim', username: 'davidk', email: 'david@example.com', isFavorite: false },
    { id: '5', displayName: 'Alex Chen', username: 'alexc', email: 'alex@example.com', isFavorite: false },
    { id: '6', displayName: 'Jessica Lee', username: 'jessical', email: 'jessica@example.com', isFavorite: true },
  ]);

  // Search users
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results.filter(r => r.id !== user?.id));
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, user?.id]);

  // Filter contacts based on tab
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchQuery || 
      contact.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'favorites') return matchesSearch && contact.isFavorite;
    if (activeTab === 'recent') return matchesSearch; // Would filter by lastInteraction
    return matchesSearch;
  });

  const handleSendMoney = (contact: Contact) => {
    navigate('/payments?tab=send', { state: { recipient: contact.username, recipientName: contact.displayName } });
  };

  const handleRequestMoney = (contact: Contact) => {
    navigate('/payments?tab=request', { state: { recipient: contact.username, recipientName: contact.displayName } });
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Contacts</h1>
          <Button size="sm" variant="outline">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts or find new users..."
            className="pl-10"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Tab Selector */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 p-1 bg-muted rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4" />
            All
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'favorites'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className="w-4 h-4" />
            Favorites
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'recent'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4" />
            Recent
          </button>
        </div>
      </div>

      {/* Search Results (when searching) */}
      {searchQuery.length >= 2 && searchResults.length > 0 && (
        <div className="px-4 mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
            PayRing Users
          </h3>
          <div className="space-y-2">
            {searchResults.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={result.displayName || ''} imageUrl={result.avatarUrl} size="md" />
                      <div>
                        <p className="font-medium">{result.displayName}</p>
                        <p className="text-sm text-muted-foreground">@{result.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate('/payments?tab=send', { state: { recipient: result.id, recipientName: result.displayName } })}>
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="px-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
          {activeTab === 'favorites' ? 'Favorite Contacts' : activeTab === 'recent' ? 'Recent Contacts' : 'All Contacts'}
        </h3>
        
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-1">No contacts found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Start adding contacts to see them here'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <UserAvatar name={contact.displayName} imageUrl={contact.avatarUrl} size="md" />
                        {contact.isFavorite && (
                          <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{contact.displayName}</p>
                        <p className="text-sm text-muted-foreground">@{contact.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleSendMoney(contact)}
                        className="text-indigo-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleRequestMoney(contact)}
                        className="text-green-600"
                      >
                        <ArrowDownLeft className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setSearchQuery('')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

export default ContactsScreen;
