import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export function TrafficAreaLine({ labels, area, line }) {
  const data = labels.map((l, i) => ({ name: l, area: area[i], line: line[i] }));

  return (
    <div className="card" style={{ height: 340 }}>
      <h3>Traffic</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4e79ff" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#4e79ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="area" stroke="#4e79ff" fill="url(#g)" />
          <Line type="monotone" dataKey="line" stroke="#2ca02c" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
