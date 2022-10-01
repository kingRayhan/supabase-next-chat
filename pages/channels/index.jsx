import { useEffect, useRef } from "react";
import Message from "~/components/Message";
import MessageInput from "~/components/MessageInput";
import { addMessage, useStore, findOrAddChannel } from "~/lib/Store";

const ChannelsPage = (props) => {
  const messagesEndRef = useRef(null);
  const { messages } = useStore({
    channelHandle: props.channelHandle,
    channelId: props.channelId,
  });

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages]);

  // Render the channels and messages
  return (
    <div>
      <div className="relative h-screen">
        <div className="Messages h-full pb-16">
          <div className="p-2 overflow-y-auto">
            {messages?.map((x) => (
              <Message key={x.id} message={x} />
            ))}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
        <div className="p-2 absolute bottom-0 left-0 w-full">
          <MessageInput
            onSubmit={async (text) =>
              addMessage(text, props.channelId, props.userId)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ChannelsPage;

export const getServerSideProps = async (context) => {
  const channelHandle = context.query.channelHandle || "channelHandle-1";

  const channel = await findOrAddChannel(channelHandle);

  findOrAddChannel();
  return {
    props: {
      userId: context.query.userId || "user-1",
      channelId: channel.id,
      channelHandle,
    },
  };
};
