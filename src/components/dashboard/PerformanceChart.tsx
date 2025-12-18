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
    <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Call Performance</h3>
          <p className="text-sm text-muted-foreground">Weekly call volume trends</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_8px_hsl(217_91%_60%/0.5)]" />
            <span className="text-sm text-muted-foreground">Outbound</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success shadow-[0_0_8px_hsl(160_84%_45%/0.5)]" />
            <span className="text-sm text-muted-foreground">Inbound</span>
          </div>
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 45%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(160, 84%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 18%)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(215, 20%, 45%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 45%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 11%)",
                border: "1px solid hsl(215, 20%, 18%)",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.4)",
              }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
              itemStyle={{ color: "hsl(210, 40%, 98%)" }}
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
              stroke="hsl(160, 84%, 45%)"
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
