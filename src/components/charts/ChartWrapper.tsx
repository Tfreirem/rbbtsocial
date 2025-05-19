import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ChartWrapperProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: any[];
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, type, data }) => {
  const COLORS = ['#FFFFFF', '#888888', '#444444', '#666666'];

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#FFFFFF" 
                strokeWidth={1.5} 
                dot={false}
              />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tick={{ fill: '#666666', fontSize: 10 }} 
                tickLine={false}
              />
              <YAxis hide={true} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111111', 
                  borderColor: '#333333',
                  color: '#fff',
                  fontSize: 10
                }} 
                cursor={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tick={{ fill: '#666666', fontSize: 10 }} 
                tickLine={false}
              />
              <YAxis hide={true} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111111', 
                  borderColor: '#333333',
                  color: '#fff',
                  fontSize: 10
                }} 
                cursor={false}
              />
              <Bar dataKey="value" fill="#FFFFFF" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={160}>
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                stroke="#111111"
                strokeWidth={1}
                fill="#FFFFFF"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111111', 
                  borderColor: '#333333',
                  color: '#fff',
                  fontSize: 10
                }} 
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#111111] rounded-md p-4 h-full">
      <h3 className="text-sm font-normal text-white mb-2">{title}</h3>
      {renderChart()}
    </div>
  );
};

export default ChartWrapper;
