import { Bar } from "recharts";

const EmotionTrends = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.emotion),
    datasets: [{
      label: "Emotion Frequency",
      data: data.map(d => d.count),
      backgroundColor: "purple",
    }]
  };

  return <Bar data={chartData} />;
};

export default EmotionTrends;
