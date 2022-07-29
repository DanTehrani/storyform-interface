import Arweave from "arweave";

// Or manually specify a host
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https"
});

export default arweave;
