import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { MoreHorizontal } from "lucide-react";

const data = [
  { name: "Mon", outbound: 420, inbound: 280 },
  { name: "Tue", outbound: 380, inbound: 320 },
  { name: "Wed", outbound: 510, inbound: 290 },
  { name: "Thu", outbound: 480, inbound: 350 },
  { name: "Fri", outbound: 590, inbound: 400 },
  { name: "Sat", outbound: 320, inbound: 180 },
  { name: "Sun", outbound: 280, inbound: 150 },
];

export function PerformanceChart() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold">Call Performance</h3>
          <p className="text-sm text-muted-foreground">Weekly call volume trends</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Outbound</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Inbound</span>
          </div>
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(220, 9%, 46%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(220, 9%, 46%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(220, 13%, 91%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="outbound"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOutbound)"
            />
            <Area
              type="monotone"
              dataKey="inbound"
              stroke="hsl(158, 64%, 52%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInbound)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
