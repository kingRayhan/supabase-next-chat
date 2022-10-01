import "~/styles/style.scss";

export default function SupabaseSlackClone({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: "#000" }}>
      <Component {...pageProps} />
    </div>
  );
}
