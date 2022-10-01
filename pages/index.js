import { useState } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [channelId, setChannelId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/channels/?userId=${userId}&channelHandle=${channelId}`);
  };

  return (
    <div className="w-full h-full flex h-screen justify-center items-center p-4 bg-gray-300">
      <div className="w-full sm:w-1/2 xl:w-1/3">
        <form
          onSubmit={handleSubmit}
          className="border-teal p-8 border-t-12 bg-white mb-6 rounded-lg shadow-lg bg-white"
        >
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">
              User ID
            </label>
            <input
              type="text"
              className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Unique user identifier"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">
              Room ID
            </label>
            <input
              type="text"
              className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Channel ID"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <button className="border border-indigo-700 text-indigo-700 py-2 px-4 rounded w-full text-center transition duration-150 hover:bg-indigo-700 hover:text-white">
              Enter Chat Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
