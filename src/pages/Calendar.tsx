import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Phone,
  Calendar as CalendarIcon,
  Clock,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentDate = new Date();

// Generate calendar days
const generateCalendarDays = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const calendar = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendar.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      events: [],
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const events = [];
    // Add some sample events
    if (i === 18) events.push({ title: "Q4 Sales Outreach", type: "campaign", status: "active" });
    if (i === 19) events.push({ title: "Lead Qualification", type: "campaign", status: "scheduled" });
    if (i === 20) events.push({ title: "Client Follow-up", type: "callback", status: "pending" });
    if (i === 22) events.push({ title: "Demo Call - Acme Inc", type: "appointment", status: "confirmed" });
    if (i === 23) events.push({ title: "Feedback Survey", type: "campaign", status: "active" });
    
    calendar.push({
      day: i,
      isCurrentMonth: true,
      isToday: i === currentDate.getDate(),
      events,
    });
  }
  
  // Next month days
  const remainingDays = 42 - calendar.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendar.push({
      day: i,
      isCurrentMonth: false,
      events: [],
    });
  }
  
  return calendar;
};

const calendarDays = generateCalendarDays();

const upcomingEvents = [
  {
    id: 1,
    title: "Q4 Sales Outreach Campaign",
    time: "9:00 AM - 5:00 PM",
    type: "campaign",
    date: "Today",
  },
  {
    id: 2,
    title: "Demo Call - Acme Inc",
    time: "2:30 PM",
    type: "appointment",
    date: "Dec 22",
  },
  {
    id: 3,
    title: "Callback - Sarah Johnson",
    time: "10:00 AM",
    type: "callback",
    date: "Dec 20",
  },
  {
    id: 4,
    title: "Lead Qualification Sprint",
    time: "All day",
    type: "campaign",
    date: "Dec 19",
  },
];

const eventTypeConfig = {
  campaign: { color: "bg-primary", label: "Campaign" },
  appointment: { color: "bg-success", label: "Appointment" },
  callback: { color: "bg-warning", label: "Callback" },
};

export default function Calendar() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Schedule campaigns, appointments, and callbacks.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Schedule Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 rounded-xl border bg-card">
          {/* Calendar Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon-sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">Today</Button>
              <Button variant="outline" size="icon-sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 border-b">
            {days.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "min-h-[100px] border-b border-r p-2 transition-colors",
                  !day.isCurrentMonth && "bg-muted/30",
                  day.isToday && "bg-primary-muted",
                  "hover:bg-muted/50 cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "mb-1 text-sm font-medium",
                    !day.isCurrentMonth && "text-muted-foreground",
                    day.isToday && "text-primary"
                  )}
                >
                  {day.day}
                </div>
                <div className="space-y-1">
                  {day.events?.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={cn(
                        "truncate rounded px-1.5 py-0.5 text-xs text-primary-foreground",
                        eventTypeConfig[event.type as keyof typeof eventTypeConfig].color
                      )}
                    >
                      {event.title}
                    </div>
                  ))}
                  {day.events && day.events.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{day.events.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card">
            <div className="border-b p-4">
              <h3 className="font-semibold">Upcoming Events</h3>
              <p className="text-sm text-muted-foreground">Next 7 days</p>
            </div>
            <div className="divide-y">
              {upcomingEvents.map((event) => {
                const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                return (
                  <div key={event.id} className="p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-1 h-2 w-2 rounded-full", config.color)} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {event.time}
                        </div>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {event.date}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border bg-card p-4">
            <h3 className="font-semibold mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  Scheduled Calls
                </div>
                <span className="font-semibold">847</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-success" />
                  Appointments
                </div>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-warning" />
                  Callbacks
                </div>
                <span className="font-semibold">23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
