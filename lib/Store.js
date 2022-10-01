import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

/**
 * @param {number} channelId the currently selected Channel
 */
export const useStore = (props) => {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [newChannel, handleNewChannel] = useState(null);
  const [deletedChannel, handleDeletedChannel] = useState(null);
  const [deletedMessage, handleDeletedMessage] = useState(null);

  // Load initial data and set up listeners
  useEffect(() => {
    // Listen for new and deleted messages
    const messageListener = supabase
      .from("messages")
      .on("INSERT", (payload) => {
        console.log({ payload });
        setNewMessage(payload.new);
      })
      .on("DELETE", (payload) => handleDeletedMessage(payload.old))
      .subscribe();

    // Listen for new and deleted channels
    const channelListener = supabase
      .from("channels")
      .on("INSERT", (payload) => {
        handleNewChannel(payload.new);
      })
      .on("DELETE", (payload) => handleDeletedChannel(payload.old))
      .subscribe();

    // Cleanup on unmount
    return () => {
      messageListener.unsubscribe();
      channelListener.unsubscribe();
    };
  }, []);

  // Update when the route changes
  useEffect(() => {
    findOrAddChannel(props.channelHandle)
      .then((channel) => {
        fetchMessages(channel.id, (messages) => {
          setMessages(messages);
        });
      })
      .catch((err) => {
        console.error(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.channelHandle]);

  // New message received from Postgres
  useEffect(() => {
    if (newMessage && newMessage.channel_id === Number(props.channelId)) {
      setMessages(messages.concat(newMessage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage]);

  // Deleted message received from postgres
  useEffect(() => {
    if (deletedMessage)
      setMessages(
        messages.filter((message) => message.id !== deletedMessage.id)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedMessage]);

  // New channel received from Postgres
  useEffect(() => {
    if (newChannel) setChannels(channels.concat(newChannel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChannel]);

  // Deleted channel received from postgres
  useEffect(() => {
    if (deletedChannel)
      setChannels(
        channels.filter((channel) => channel.id !== deletedChannel.id)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedChannel]);

  return {
    // We can export computed values here to map the authors to each message
    messages,
    channels:
      channels !== null
        ? channels.sort((a, b) => a.slug.localeCompare(b.slug))
        : [],
  };
};

/**
 * Fetch a single user
 * @param {number} userId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUser = async (userId, setState) => {
  //
};

/**
 * Fetch all messages and their authors
 * @param {number} channelId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchMessages = async (channelId, setState) => {
  try {
    let { body } = await supabase
      .from("messages")
      .select(`*`)
      .eq("channel_id", channelId)
      .order("inserted_at", true);
    if (setState) setState(body);
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * Insert a new channel into the DB
 * @param {string} slug The channel name
 * @param {number} user_id The channel creator
 */
export const findOrAddChannel = async (channel_handle) => {
  try {
    let { body: channels } = await supabase
      .from("channels")
      .select("*")
      .eq("channel_handle", channel_handle);

    if (channels.length > 0) {
      return channels[0];
    }

    let { body } = await supabase.from("channels").insert([{ channel_handle }]);
    return body[0];
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * Insert a new message into the DB
 * @param {string} message The message text
 * @param {number} channel_id
 * @param {number} user_id The author
 */
export const addMessage = async (message, channel_id, user_id) => {
  try {
    let { body } = await supabase
      .from("messages")
      .insert([{ message, channel_id, user_id }]);
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * Delete a channel from the DB
 * @param {number} channel_id
 */
export const deleteChannel = async (channel_id) => {
  try {
    let { body } = await supabase
      .from("channels")
      .delete()
      .match({ id: channel_id });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * Delete a message from the DB
 * @param {number} message_id
 */
export const deleteMessage = async (message_id) => {
  try {
    let { body } = await supabase
      .from("messages")
      .delete()
      .match({ id: message_id });
    return body;
  } catch (error) {
    console.log("error", error);
  }
};
