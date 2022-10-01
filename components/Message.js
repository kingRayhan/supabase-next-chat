const Message = ({ message }) => {
  return (
    <div className="py-1 flex items-center space-x-2">
      <div>
        <p className="text-blue-700 font-bold">{message.user_id}</p>
        <p className="text-white">{message.message}</p>
      </div>
    </div>
  );
};

export default Message;
