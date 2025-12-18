import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Upload,
  Download,
  Mail,
  Phone,
  Tag,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const contacts = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    status: "contacted",
    lastContacted: "Dec 15, 2024",
    tags: ["Enterprise", "Hot Lead"],
    source: "Website",
    campaigns: 3,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@business.io",
    phone: "+1 (555) 987-6543",
    status: "qualified",
    lastContacted: "Dec 14, 2024",
    tags: ["SMB", "Demo Scheduled"],
    source: "LinkedIn",
    campaigns: 2,
  },
  {
    id: 3,
    name: "Mike Williams",
    email: "mike.w@startup.co",
    phone: "+1 (555) 456-7890",
    status: "new",
    lastContacted: null,
    tags: ["Startup"],
    source: "Referral",
    campaigns: 0,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@corp.net",
    phone: "+1 (555) 321-0987",
    status: "contacted",
    lastContacted: "Dec 12, 2024",
    tags: ["Enterprise", "Follow-up"],
    source: "Trade Show",
    campaigns: 4,
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "r.brown@agency.com",
    phone: "+1 (555) 654-3210",
    status: "unresponsive",
    lastContacted: "Nov 28, 2024",
    tags: ["Agency"],
    source: "Cold Outreach",
    campaigns: 2,
  },
  {
    id: 6,
    name: "Jennifer Lee",
    email: "jlee@healthcare.org",
    phone: "+1 (555) 789-0123",
    status: "qualified",
    lastContacted: "Dec 16, 2024",
    tags: ["Healthcare", "Priority"],
    source: "Website",
    campaigns: 1,
  },
  {
    id: 7,
    name: "David Chen",
    email: "d.chen@tech.io",
    phone: "+1 (555) 234-5678",
    status: "new",
    lastContacted: null,
    tags: ["Tech", "Startup"],
    source: "Product Hunt",
    campaigns: 0,
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa@fitness.com",
    phone: "+1 (555) 876-5432",
    status: "contacted",
    lastContacted: "Dec 13, 2024",
    tags: ["Fitness", "SMB"],
    source: "Google Ads",
    campaigns: 2,
  },
];

const statusConfig = {
  new: { label: "New", variant: "info" as const },
  contacted: { label: "Contacted", variant: "warning" as const },
  qualified: { label: "Qualified", variant: "success" as const },
  unresponsive: { label: "Unresponsive", variant: "error" as const },
};

export default function Contacts() {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

  const toggleContact = (id: number) => {
    setSelectedContacts(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedContacts(prev => 
      prev.length === contacts.length ? [] : contacts.map(c => c.id)
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contact database and track interactions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="text-2xl font-bold">{contacts.length}</div>
          <div className="text-sm text-muted-foreground">Total Contacts</div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-2xl font-bold text-info">
            {contacts.filter(c => c.status === "new").length}
          </div>
          <div className="text-sm text-muted-foreground">New</div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-2xl font-bold text-success">
            {contacts.filter(c => c.status === "qualified").length}
          </div>
          <div className="text-sm text-muted-foreground">Qualified</div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-2xl font-bold text-warning">
            {contacts.filter(c => c.status === "contacted").length}
          </div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search contacts..." className="pl-9" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        {selectedContacts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedContacts.length} selected
            </span>
            <Button variant="outline" size="sm">Add to Campaign</Button>
            <Button variant="outline" size="sm">Add Tags</Button>
          </div>
        )}
      </div>

      {/* Contacts Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedContacts.length === contacts.length}
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Contact</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Tags</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Last Contacted</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Campaigns</th>
                <th className="p-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contacts.map((contact) => {
                const status = statusConfig[contact.status as keyof typeof statusConfig];
                return (
                  <tr key={contact.id} className="transition-colors hover:bg-muted/50">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleContact(contact.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-muted-foreground">{contact.source}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          {contact.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {contact.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {contact.lastContacted || "Never"}
                    </td>
                    <td className="p-4 text-sm">
                      {contact.campaigns}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
