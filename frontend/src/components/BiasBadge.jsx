const colors = {
  OPTIMISTIC: "bg-red-100 text-red-700",
  REALISTIC: "bg-green-100 text-green-700",
  FEARFUL: "bg-yellow-100 text-yellow-700",
};

const BiasBadge = ({ biasType }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[biasType]}`}>
      {biasType}
    </span>
  );
};

export default BiasBadge;