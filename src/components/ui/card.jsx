export default function Card({ children, ...props }) {
    return (
      <div {...props} className="p-4 bg-white rounded shadow-md">
        {children}
      </div>
    );
  }
  