import { connectToServer } from "./socket-client";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h2>WebSocket Client</h2>

		<input id="jwtToken" placeholder="Enter a JWT token" />
		<button id="connect-button">Connect</button>

		<br />
		<span id="server-status">Offline</span>
		<ul id="clients">
		</ul>
		<form id="message-form">
			<input type="text" placeholder="Enter a message" id="message-input" />
		</form>
		<h3>Messages</h3>
		<ul id="messages">
		</ul>
  </div>
`;

const $input = document.querySelector<HTMLInputElement>("#jwtToken")!;
const $connectButton =
  document.querySelector<HTMLButtonElement>("#connect-button")!;

$connectButton.addEventListener("click", () => {
  const jwtToken = $input.value.trim();
  if (!jwtToken) {
    alert("Please enter a JWT token");
    return;
  }
  connectToServer(jwtToken);
});
