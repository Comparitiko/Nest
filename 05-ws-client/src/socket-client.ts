import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (jwtToken: string) => {
  console.log(jwtToken);
  const manager = new Manager("http://localhost:3000/socket.io/socket.io.js", {
    extraHeaders: {
      authentication: jwtToken,
    },
  });

  if (socket) {
    socket.removeAllListeners();
  }

  socket = manager.socket("/");

  addListeners();
};

const addListeners = () => {
  const $serverStatus =
    document.querySelector<HTMLSpanElement>("#server-status");
  const $clients = document.querySelector<HTMLUListElement>("#clients")!; // Con la ! digo que es seguro, no es null
  const $messageForm =
    document.querySelector<HTMLFormElement>("#message-form")!;
  const $messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;
  const $messagesList = document.querySelector<HTMLUListElement>("#messages")!;

  if (!$serverStatus) {
    throw new Error("Could not find server status element");
  }

  socket.on("connect", () => {
    $serverStatus.innerText = "Connected";
  });

  socket.on("disconnect", () => {
    $serverStatus.innerText = "Disconnected";
  });

  socket.on("clients-updated", (clients: string[]) => {
    $clients.innerHTML = "";
    clients.forEach((client) => {
      $clients.innerHTML += `<li>${client}</li>`;
    });
  });

  socket.on(
    "message-from-server",
    (message: { fullName: string; message: string }) => {
      console.log(message);
      $messagesList.innerHTML += `<li>
				<strong>${message.fullName}</strong>
				<span>${message.message}</span>
			</li>`;
    }
  );

  $messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = $messageInput.value.trim();
    if (!message) {
      return;
    }

    socket.emit("message-from-client", { message });

    $messageInput.value = "";
  });
};
